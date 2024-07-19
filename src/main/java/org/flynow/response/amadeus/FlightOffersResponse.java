package org.flynow.response.amadeus;

import com.amadeus.resources.FlightOfferSearch;

public record FlightOffersResponse(FlightOfferSearch[] data, Dictionaries dictionaries) {
}
