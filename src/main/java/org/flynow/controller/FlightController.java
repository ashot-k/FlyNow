package org.flynow.controller;

import org.flynow.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/flight")
public class FlightController {

    @PostMapping("/book")
     public ResponseEntity<String> bookFlight() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return null;
    }

}