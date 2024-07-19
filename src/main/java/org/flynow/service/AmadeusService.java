package org.flynow.service;

import com.amadeus.Params;
import com.amadeus.exceptions.ResponseException;
import com.amadeus.resources.Activity;
import com.amadeus.resources.Location;
import org.flynow.response.TokenResponse;
import org.flynow.response.amadeus.Destination;
import org.flynow.response.amadeus.FlightOffersResponse;
import reactor.core.publisher.Mono;

public interface AmadeusService {

    Location[] searchAirport(Params params) throws ResponseException;

    Destination[] searchAvailableDestinations(Params params) throws ResponseException;

    FlightOffersResponse searchFlightOffers(Params params) throws ResponseException;

    Activity[] searchActivities(Params params) throws ResponseException;

    Mono<TokenResponse> getToken();
}
