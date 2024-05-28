package org.flynow.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/flight")
@CrossOrigin(origins = {"http://localhost:3000"})
public class FlightController {



    @PostMapping("/book")
     public ResponseEntity<String> bookFlight( ) {
        return null;
    }


}