package org.flynow.controller;

import org.flynow.config.security.TokenResponse;
import org.flynow.dto.JwtTokenRequest;
import org.flynow.dto.LoginDTO;
import org.flynow.dto.RegistrationDTO;
import org.flynow.entity.User;
import org.flynow.repository.RoleRepo;
import org.flynow.repository.UserRepo;
import org.flynow.service.CustomUserDetailsService;
import org.flynow.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.1.64:3000", "http://192.168.1.80:3000", "http://192.168.1.64:8079"})
public class AuthController {

    private final JwtService jwtService;
    UserDetailsService userDetailsService;
    UserRepo userRepo;
    RoleRepo roleRepo;
    PasswordEncoder passwordEncoder;
    AuthenticationManager authManager;

    public AuthController(CustomUserDetailsService customUserDetailsService, UserRepo userRepo, RoleRepo roleRepo, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userDetailsService = customUserDetailsService;
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.passwordEncoder = passwordEncoder;
        this.authManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegistrationDTO registrationInfo) {
        if (userRepo.existsByUsername(registrationInfo.getUsername())) {
            return new ResponseEntity<>("Username is taken", HttpStatus.BAD_REQUEST);
        }
        User user = new User();
        user.setUsername(registrationInfo.getUsername());
        user.setPassword(passwordEncoder.encode(registrationInfo.getPassword()));
        userRepo.save(user);
        return new ResponseEntity<>("User: " + user.getUsername() + " successfully created", HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginDTO loginDTO) {
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDTO.getUsername(), loginDTO.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwtToken = jwtService.generateToken(userRepo.findByUsername(loginDTO.getUsername()).get());

        return new ResponseEntity<>(new LoginResponse(jwtToken, jwtService.getExpirationTime()), HttpStatus.OK);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refreshToken(@RequestBody JwtTokenRequest jwtTokenRequest) {
        UserDetails user = userDetailsService.loadUserByUsername(jwtService.extractUsername(jwtTokenRequest.getToken()));
        boolean valid = jwtService.isTokenValid(jwtTokenRequest.getToken(), user);
        if (valid) {
            return new ResponseEntity<>(new TokenResponse(jwtTokenRequest.getToken(), jwtService.getExpirationTime()), HttpStatus.OK);
        }

        return new ResponseEntity<>(new TokenResponse(jwtService.generateToken(user), jwtService.getExpirationTime()), HttpStatus.OK);
    }
}
