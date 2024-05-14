package org.flynow.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

@RestController("/api/flight")

@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.1.64:3000", "http://192.168.1.80:3000"})
public class FlightController {
    @GetMapping("/book-flight")
    public ResponseEntity<String> bookFlight() {
        WebClient.Builder builder = WebClient.builder();
        builder.build()
                .get()
                .uri("https://catfact.ninja/fact?max_length=140")
                .retrieve().bodyToMono(String.class).subscribe(f -> {
                });

        return null;
    }
}
