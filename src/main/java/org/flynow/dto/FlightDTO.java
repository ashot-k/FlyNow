package org.flynow.dto;

import jakarta.validation.constraints.NotBlank;

public record FlightDTO(@NotBlank(message = "Carrier code is required") String carrierCode,
                        @NotBlank(message = "Departure date is required") String departureDate, String returnDate,
                        @NotBlank(message = "Flight code is required") String flightNumber) {
}