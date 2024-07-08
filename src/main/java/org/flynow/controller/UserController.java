package org.flynow.controller;

import jakarta.websocket.server.PathParam;
import org.flynow.dto.UserDTO;
import org.flynow.entity.Address;
import org.flynow.entity.User;
import org.flynow.repository.UserRepo;
import org.flynow.request.JwtTokenRequest;
import org.flynow.service.CustomUserDetailsService;
import org.flynow.service.JwtService;
import org.flynow.service.UserService;
import org.flynow.service.UserServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepo userRepo;
    UserService userService;
    UserDetailsService userDetailsService;
    JwtService jwtService;
    public UserController(UserServiceImpl userService, CustomUserDetailsService userDetailsService, JwtService jwtService, UserRepo userRepo){
        this.userService = userService;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.userRepo = userRepo;
    }

    @GetMapping
    public ResponseEntity<UserDTO> getUserInformation() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Address address = user.getAddress();
            return new ResponseEntity<>(new UserDTO(user.getUsername(), user.getEmail(),
                    address.getPhoneNumber(), address.getCountry(),
                    address.getFirstName(), address.getLastName(),
                    address.getCity(), address.getPostalCode()), HttpStatus.OK);

    }


}
