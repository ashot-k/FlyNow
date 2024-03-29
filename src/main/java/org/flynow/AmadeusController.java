package org.flynow;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;


@RestController
@RequestMapping("/amadeus")

@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.1.64:3000",  "http://192.168.1.80:3000"})
public class AmadeusController {

    private static final String clientId = "p4UGMP3eCgppuqZGULHS9XoUJ6xfjMaY";
    private static final String clientSecret = "9gwmDOSJZn008u5n";
    private static final String tokenURI = "https://test.api.amadeus.com/v1/security/oauth2/token";

    @GetMapping("/token")
    public ResponseEntity<String> getToken() {
        WebClient client = WebClient.builder()
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .build();
        Mono<ClientResponse> responseMono = client.method(HttpMethod.POST)
                .uri(tokenURI)
                .body(BodyInserters.fromFormData("grant_type", "client_credentials")
                        .with("client_id", clientId)
                        .with("client_secret", clientSecret)).exchange();

        AmadeusTokenExtractor amadeusTokenExtractor = new AmadeusTokenExtractor();

        return responseMono.flatMap(response -> {
            if (response.statusCode().is2xxSuccessful()) {
                return response.bodyToMono(String.class).map(token -> ResponseEntity.ok().body(amadeusTokenExtractor.extractAccessToken(token)));
            } else {
                return Mono.error(new RuntimeException("API call failed with status code: " + response.statusCode().value()));
            }
        }).block();
    }
}
