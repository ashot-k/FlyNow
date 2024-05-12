package org.flynow.controller;

import org.flynow.config.security.AmadeusToken;
import org.flynow.config.security.TokenResponse;
import org.flynow.utils.AmadeusURLs;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;


@RestController
@RequestMapping("/amadeus")

@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.1.64:3000", "http://192.168.1.80:3000"})
public class AmadeusController {

    @Value("${amadeus.client.id}")
    private String clientId;
    @Value("${amadeus.client.secret}")
    private String clientSecret;

    @GetMapping("/token")
    public Mono<TokenResponse> getToken() {
        WebClient client = WebClient.builder()
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .build();
        return client.post()
                .uri(AmadeusURLs.tokenURL)
                .body(BodyInserters.fromFormData("grant_type", "client_credentials")
                        .with("client_id", clientId)
                        .with("client_secret", clientSecret))
                .retrieve()
                .bodyToMono(String.class)
                .flatMap(response -> {
                    String token = AmadeusToken.extractAccessToken(response);
                    long expiration = AmadeusToken.extractExpiration(response);
                    TokenResponse tokenResponse = new TokenResponse(token, expiration);
                    return Mono.just(tokenResponse);
                });
        }


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
