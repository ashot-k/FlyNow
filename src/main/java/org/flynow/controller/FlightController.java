package org.flynow.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/flight")
@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.1.64:3000", "http://192.168.1.80:3000", "http://192.168.1.64:8079"})
public class FlightController {



    @PostMapping("/book")
     public ResponseEntity<String> bookFlight( ) {
        return null;
    }


}