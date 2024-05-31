package org.flynow.controller;


import org.flynow.dto.SearchAnalyticsDTO;
import org.flynow.entity.User;
import org.flynow.entity.analytics.SearchAnalytics;
import org.flynow.repository.UserRepo;
import org.flynow.service.AnalyticsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    AnalyticsService analyticsService;
    UserRepo userRepo;

    public AnalyticsController(AnalyticsService analyticsService, UserRepo userRepo) {
        this.analyticsService = analyticsService;
        this.userRepo = userRepo;
    }

    @GetMapping("/search-analytics")
    public ResponseEntity<List<SearchAnalyticsDTO>> getSearchAnalytics() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return new ResponseEntity<>(analyticsService.getUserRecentSearches(user.getId()), HttpStatus.OK);
    }

    @PostMapping("/search-analytics")
    public ResponseEntity<String> saveSearchAnalytics(@RequestBody SearchAnalyticsDTO searchAnalyticsDTO) {
        if(analyticsService.saveSearchAnalytics(searchAnalyticsDTO) != null)
            return new ResponseEntity<>(HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

}
