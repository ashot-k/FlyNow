package org.flynow.entity.analytics;

import jakarta.persistence.*;
import org.flynow.entity.User;

import java.time.Instant;

@Entity
public class SearchAnalytics {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;
    private String origin;
    private String destination;
    private int counter = 1;
    private Instant searchTime = Instant.now();
    @ManyToOne
    private User user;

    public SearchAnalytics() {
    }

    public SearchAnalytics(Long id, String origin, String destination, int counter, User user) {
        this.id = id;
        this.origin = origin;
        this.destination = destination;
        this.counter = counter;
        this.user = user;
    }

    public Instant getSearchTime() {
        return searchTime;
    }

    public void setSearchTime(Instant searchTime) {
        this.searchTime = searchTime;
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
