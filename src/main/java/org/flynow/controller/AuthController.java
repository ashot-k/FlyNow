package org.flynow.controller;

import jakarta.validation.Valid;
import org.flynow.dto.UserDTO;
import org.flynow.entity.Address;
import org.flynow.exceptions.authexceptions.WrongCredentialsException;
import org.flynow.response.TokenResponse;
import org.flynow.request.JwtTokenRequest;
import org.flynow.dto.LoginDTO;
import org.flynow.dto.RegistrationDTO;
import org.flynow.entity.User;
import org.flynow.repository.RoleRepo;
import org.flynow.repository.UserRepo;
import org.flynow.service.CustomUserDetailsService;
import org.flynow.service.JwtService;
import org.flynow.service.UserService;
import org.flynow.service.UserServiceImpl;
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

import java.time.Instant;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    JwtService jwtService;
    UserDetailsService userDetailsService;
    UserRepo userRepo;
    UserService userService;
    RoleRepo roleRepo;
    PasswordEncoder passwordEncoder;
    AuthenticationManager authManager;

    public AuthController(CustomUserDetailsService customUserDetailsService, UserServiceImpl userService, UserRepo userRepo, RoleRepo roleRepo, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userDetailsService = customUserDetailsService;
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.passwordEncoder = passwordEncoder;
        this.authManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@Valid @RequestBody RegistrationDTO registrationDTO) {
        if (userRepo.existsByUsername(registrationDTO.username())) {
            throw new WrongCredentialsException("Username is taken");
        }
        return new ResponseEntity<>(userService.registerUser(registrationDTO), HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginDTO loginDTO) {
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDTO.username(), loginDTO.password()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwtToken = jwtService.generateToken(userRepo.findByUsername(loginDTO.username()).get());
        return new ResponseEntity<>(new TokenResponse(jwtToken, jwtService.getExpirationTime(), Instant.now()), HttpStatus.OK);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refreshToken(@RequestBody JwtTokenRequest jwtTokenRequest) {
        UserDetails user = userDetailsService.loadUserByUsername(jwtService.extractUsername(jwtTokenRequest.getToken()));
        return new ResponseEntity<>(new TokenResponse(jwtService.generateToken(user), jwtService.getExpirationTime(), Instant.now()), HttpStatus.OK);
    }
}
