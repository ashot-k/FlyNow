package org.flynow.controller;

import com.amadeus.Params;
import com.amadeus.exceptions.ResponseException;
import com.amadeus.resources.Activity;
import com.amadeus.resources.Location;
import org.flynow.response.TokenResponse;
import org.flynow.response.amadeus.Destination;
import org.flynow.response.amadeus.FlightOffersResponse;
import org.flynow.service.AmadeusService;
import org.flynow.service.AmadeusServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.time.LocalDate;

@RestController
@RequestMapping("/amadeus")
public class AmadeusController {

    private final AmadeusService amadeusService;

    public AmadeusController(AmadeusServiceImpl amadeusService) {
        this.amadeusService = amadeusService;
    }


    @GetMapping("/token")
    public Mono<TokenResponse> getToken() {
        return amadeusService.getToken();
    }

    @GetMapping("/flight-offers")
    public ResponseEntity<FlightOffersResponse> searchFlightOffers(
            @RequestParam("origin") String originIATA,
            @RequestParam("destination") String destinationIATA,
            @RequestParam("departureDate") LocalDate departureDate,
            @RequestParam(value = "returnDate", required = false) LocalDate returnDate,
            @RequestParam(value = "adults", defaultValue = "1") int adults,
            @RequestParam(value = "children", defaultValue = "0") int children,
            @RequestParam(value = "currencyCode", required = false) String currencyCode,
            @RequestParam(value = "max", defaultValue = "25") int max

    ) throws ResponseException {

        Params params = Params.with("originLocationCode", originIATA)
                .and("destinationLocationCode", destinationIATA)
                .and("departureDate", departureDate)
                .and("adults", adults)
                .and("children", children)
                .and("max", max);
        if (returnDate != null) {
            params.and("returnDate", returnDate);
        }
        if (currencyCode != null)
            params.and("currencyCode", currencyCode);
        return new ResponseEntity<>(amadeusService.searchFlightOffers(params), HttpStatus.OK);
    }

    @GetMapping("/locations")
    public ResponseEntity<Location[]> searchAirport(
            @RequestParam("keyword") String keyword,
            @RequestParam(value = "subType", required = false, defaultValue = "AIRPORT") String subType) throws ResponseException {
        Params params = Params.with("keyword", keyword).and("subType", subType);
        return new ResponseEntity<>(amadeusService.searchAirport(params), HttpStatus.OK);
    }

    @GetMapping("/destinations")
    public ResponseEntity<Destination[]> searchAvailableDestinations(
            @RequestParam("departureAirportCode") String origin) throws ResponseException {
        Params params = Params.with("departureAirportCode", origin);
        return new ResponseEntity<>(amadeusService.searchAvailableDestinations(params), HttpStatus.OK);
    }

    @GetMapping("/activities")
    public ResponseEntity<Activity[]> searchActivities(
            @RequestParam("latitude") double latitude,
            @RequestParam("longitude") double longitude,
            @RequestParam(value = "radius", required = false, defaultValue = "1") int radius
    ) throws ResponseException {
        Params params = Params.with("latitude", latitude).and("longitude", longitude).and("radius", radius);
        return new ResponseEntity<>(amadeusService.searchActivities(params), HttpStatus.OK);
    }

}
