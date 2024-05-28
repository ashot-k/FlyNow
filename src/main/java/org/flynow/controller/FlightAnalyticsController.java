package org.flynow.controller;

import jakarta.persistence.EntityNotFoundException;
import org.flynow.entity.User;
import org.flynow.entity.analytics.BookingAnalytics;
import org.flynow.repository.BookingAnalyticsRepo;
import org.flynow.repository.SearchAnalyticsRepo;
import org.flynow.repository.UserRepo;
import org.flynow.response.FlightRecommendation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/flight-analytics")
@CrossOrigin(origins = {"http://localhost:3000"})
public class FlightAnalyticsController {
    UserRepo userRepo;
    BookingAnalyticsRepo bookingAnalyticsRepo;
    SearchAnalyticsRepo searchAnalyticsRepo;

    public FlightAnalyticsController(UserRepo userRepo, BookingAnalyticsRepo bookingAnalyticsRepo, SearchAnalyticsRepo searchAnalyticsRepo) {
        this.userRepo = userRepo;
        this.bookingAnalyticsRepo = bookingAnalyticsRepo;
        this.searchAnalyticsRepo = searchAnalyticsRepo;
    }

    @GetMapping("/recommend/user-book-history")
    public ResponseEntity<FlightRecommendation> recommendBasedOnUserBookHistory() throws EntityNotFoundException {
        Optional<User> user  = userRepo.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        if(user.isPresent()) {
            Page<BookingAnalytics> topRecommendations = bookingAnalyticsRepo.findByUserId(user.get().getId(), PageRequest.of(0, 5));
            HashMap<String, String> flightsMap = new HashMap<>();
            for (final BookingAnalytics flight : topRecommendations.getContent()) {
              flightsMap.put(flight.getOrigin(), flight.getDestination());
            }
            return new ResponseEntity<>(new FlightRecommendation(flightsMap), HttpStatus.OK);
        }
        else
            throw new EntityNotFoundException();
    }

    @GetMapping("/recommend/user-search-history")
    public ResponseEntity<FlightRecommendation> recommendBasedOnUserSearchHistory() throws EntityNotFoundException {
        return null;
    }

    @PostMapping("/log-search-term")
    public ResponseEntity<String> logSearchTerm(@RequestParam(name = "term") String term) {
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
