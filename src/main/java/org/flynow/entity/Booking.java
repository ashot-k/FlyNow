package org.flynow.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "price")
    private Double price;
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Flight> flights = new ArrayList<>();

    @ManyToOne
    private User user;

    public Booking() {
    }

    public Booking(Double price, List<Flight> flights) {
        this.price = price;
        this.flights = flights;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Flight> getFlights() {
        return flights;
    }

    public void setFlights(List<Flight> flights) {
        this.flights = flights;
    }
}
