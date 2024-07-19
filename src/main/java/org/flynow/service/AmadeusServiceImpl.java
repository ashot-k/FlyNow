package org.flynow.service;

import com.amadeus.Amadeus;
import com.amadeus.Params;
import com.amadeus.exceptions.ResponseException;
import com.amadeus.resources.Activity;
import com.amadeus.resources.FlightOfferSearch;
import com.amadeus.resources.Location;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.annotation.PostConstruct;
import org.flynow.config.security.AmadeusToken;
import org.flynow.response.TokenResponse;
import org.flynow.response.amadeus.Destination;
import org.flynow.response.amadeus.Dictionaries;
import org.flynow.response.amadeus.FlightOffersResponse;
import org.flynow.utils.AmadeusURLs;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Instant;

@Service
public class AmadeusServiceImpl implements AmadeusService {

    @Value("${dev.mode}")
    private String devMode;

    @Value("${amadeus.client.id}")
    private String clientId;
    @Value("${amadeus.client.secret}")
    private String clientSecret;

    private Amadeus amadeus;
    private Gson gson;

    @PostConstruct
    public void init() {
        this.amadeus = Amadeus
                .builder(clientId, clientSecret)
                .build();
    }

    public AmadeusServiceImpl() {
        this.gson = new Gson();
    }

    @Override
    public Location[] searchAirport(Params params) throws ResponseException {
        return amadeus.referenceData.locations.get(params);
    }

    @Override
    public Destination[] searchAvailableDestinations(Params params) throws ResponseException {
        return gson.fromJson(amadeus.airport.directDestinations.get(params)[0].getResponse().getData(), Destination[].class);
    }

    @Override
    public FlightOffersResponse searchFlightOffers(Params params) throws ResponseException {
        Dictionaries dictionaries;
        FlightOfferSearch[] flightOffersSearches = amadeus.shopping.flightOffersSearch.get(params);
        JsonObject jsonObject = gson.fromJson(flightOffersSearches[0].getResponse().getResult(), JsonObject.class);
        dictionaries = gson.fromJson(jsonObject.get("dictionaries"), Dictionaries.class);
        flightOffersSearches = gson.fromJson(jsonObject.get("data"), FlightOfferSearch[].class);
        return new FlightOffersResponse(flightOffersSearches, dictionaries);
    }

    @Override
    public Activity[] searchActivities(Params params) throws ResponseException {
        return amadeus.shopping.activities.get(params);
    }

    @Override
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
                    TokenResponse tokenResponse = new TokenResponse(token, expiration, Instant.now().toString());
                    return Mono.just(tokenResponse);
                });
    }
}
