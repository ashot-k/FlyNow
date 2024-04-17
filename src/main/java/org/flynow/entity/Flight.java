package org.flynow.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Flight {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;

    private String flightNo;
    private String origin;
    private String destination;
    private int stops;
    private LocalDate departureDate;
    private LocalDate returnDate;
    private String flightType;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
