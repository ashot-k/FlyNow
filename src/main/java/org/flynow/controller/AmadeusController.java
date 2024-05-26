package org.flynow.controller;

import org.flynow.config.security.AmadeusToken;
import org.flynow.response.TokenResponse;
import org.flynow.utils.AmadeusURLs;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Instant;


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
                    TokenResponse tokenResponse = new TokenResponse(token, expiration, Instant.now());
                    return Mono.just(tokenResponse);
                });
    }

    /*@PostMapping("/")
    public void logSearchTerm(@RequestBody String ){

    }
*/

}
