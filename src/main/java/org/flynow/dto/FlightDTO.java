package org.flynow.dto;

import java.util.Date;

public record FlightDTO(String origin, String destination, String departureDate, String flightCode) {
    public FlightDTO {
    }
}
