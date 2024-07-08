package org.flynow.entity;

import com.amadeus.resources.FlightOfferSearch;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Currency;

@Entity
@Table(name = "flights")
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "flight_id", nullable = false)
    private Long id;
    private Instant departureDate;
    private Instant returnDate;
    private String flightCode;
    private String direction;

    @ManyToOne
    @JoinColumn(name = "booking_id", referencedColumnName = "booking_id")
    @NotNull
    private Booking booking;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDepartureDate() {
        return departureDate;
    }

    public void setDepartureDate(Instant departureDate) {
        this.departureDate = departureDate;
    }

    public Instant getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(Instant returnDate) {
        this.returnDate = returnDate;
    }

    public String getFlightCode() {
        return flightCode;
    }

    public void setFlightCode(String flightCode) {
        this.flightCode = flightCode;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }
}
