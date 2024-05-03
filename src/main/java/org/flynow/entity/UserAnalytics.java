package org.flynow.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class UserAnalytics {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    @Column(name = "destination_searched")
    private String destinationsSearched;
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getDestinationsSearched() {
        return destinationsSearched;
    }

    public void setDestinationsSearched(String destinationsSearched) {
        this.destinationsSearched = destinationsSearched;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
