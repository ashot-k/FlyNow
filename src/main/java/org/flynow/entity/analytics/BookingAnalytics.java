package org.flynow.entity.analytics;

import jakarta.persistence.*;
import org.flynow.entity.User;

import java.time.Instant;

@Entity
public class BookingAnalytics {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;
    private String origin;
    private String destination;
    private int counter;
    private Instant instant = Instant.now();
    @ManyToOne
    private User user;

    public BookingAnalytics() {
    }

    public BookingAnalytics(Long id, String origin, String destination, int counter, User user) {
        this.id = id;
        this.origin = origin;
        this.destination = destination;
        this.counter = counter;
        this.user = user;
    }

    public Instant getInstant() {
        return instant;
    }

    public void setInstant(Instant instant) {
        this.instant = instant;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public int getCounter() {
        return counter;
    }

    public void setCounter(int counter) {
        this.counter = counter;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
