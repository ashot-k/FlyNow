package org.flynow.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;

    private String name;
    private String username;
    private String password;
    @OneToMany
    @JoinColumn(name = "booked_flights")
    private List<Flight> bookedFlights;
    @OneToOne
    @JoinColumn(name = "user_analytics_id")
    private UserAnalytics userAnalytics;

    public User(String name, String username, String password, List<Flight> bookedFlights, UserAnalytics userAnalytics) {
        this.name = name;
        this.username = username;
        this.password = password;
        this.bookedFlights = bookedFlights;
        this.userAnalytics = userAnalytics;
    }

    public User(Long id, String name, String username, String password, List<Flight> bookedFlights, UserAnalytics userAnalytics) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.password = password;
        this.bookedFlights = bookedFlights;
        this.userAnalytics = userAnalytics;
    }

    public User() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Flight> getBookedFlights() {
        return bookedFlights;
    }

    public void setBookedFlights(List<Flight> bookedFlights) {
        this.bookedFlights = bookedFlights;
    }

    public UserAnalytics getUserAnalytics() {
        return userAnalytics;
    }

    public void setUserAnalytics(UserAnalytics userAnalytics) {
        this.userAnalytics = userAnalytics;
    }
}
