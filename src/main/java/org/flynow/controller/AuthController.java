package org.flynow.controller;

import org.flynow.dto.LoginDTO;
import org.flynow.dto.RegistrationDTO;
import org.flynow.entity.User;
import org.flynow.repository.RoleRepo;
import org.flynow.repository.UserRepo;
import org.flynow.service.CustomUserDetailsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.1.64:3000", "http://192.168.1.80:3000"})
public class AuthController {

    UserDetailsService userDetailsService;
    UserRepo userRepo;
    RoleRepo roleRepo;
    PasswordEncoder passwordEncoder;
    AuthenticationManager authManager;

    public AuthController(CustomUserDetailsService customUserDetailsService, UserRepo userRepo, RoleRepo roleRepo, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
        this.userDetailsService = customUserDetailsService;
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.passwordEncoder = passwordEncoder;
        this.authManager = authenticationManager;
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
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO) {
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDTO.getUsername(), loginDTO.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return new ResponseEntity<>("Authentication success", HttpStatus.OK);
    }
}
