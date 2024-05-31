package org.flynow.service;

import org.flynow.dto.BookingAnalyticsDTO;
import org.flynow.dto.SearchAnalyticsDTO;
import org.flynow.entity.User;
import org.flynow.entity.analytics.BookingAnalytics;
import org.flynow.entity.analytics.SearchAnalytics;
import org.flynow.repository.BookingAnalyticsRepo;
import org.flynow.repository.SearchAnalyticsRepo;
import org.flynow.repository.UserRepo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {
    private BookingAnalyticsRepo bookingAnalyticsRepo;
    private SearchAnalyticsRepo searchAnalyticsRepo;

    public AnalyticsServiceImpl(BookingAnalyticsRepo bookingAnalyticsRepo, SearchAnalyticsRepo searchAnalyticsRepo) {
        this.bookingAnalyticsRepo = bookingAnalyticsRepo;
        this.searchAnalyticsRepo = searchAnalyticsRepo;
    }

    @Override
    public SearchAnalytics saveSearchAnalytics(SearchAnalyticsDTO searchAnalyticsDTO) {
        SearchAnalytics searchAnalytics = new SearchAnalytics();
        searchAnalytics.setOrigin(searchAnalyticsDTO.origin());
        searchAnalytics.setDestination(searchAnalyticsDTO.destination());
        searchAnalytics.setUser((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        Optional<SearchAnalytics> duplicate = searchAnalyticsRepo.findByUserIdAndOriginAndDestination(searchAnalytics.getUser().getId(), searchAnalytics.getOrigin(), searchAnalytics.getDestination());
        if(duplicate.isPresent()){
            SearchAnalytics dup = duplicate.get();
           dup.setCounter(dup.getCounter() + 1);
           dup.setSearchTime(Instant.now());
           return searchAnalyticsRepo.save(dup);
        }
        return searchAnalyticsRepo.save(searchAnalytics);
    }

    @Override
    public BookingAnalytics saveBookingAnalytics(BookingAnalyticsDTO bookingAnalytics) {
        return null;
    }

    @Override
    public List<SearchAnalyticsDTO> getUserRecentSearches(Long userId) {
        List<SearchAnalytics> searchAnalytics = searchAnalyticsRepo.findByUserIdOrderBySearchTimeDesc(userId, PageRequest.of(0, 5)).toList();
        List<SearchAnalyticsDTO> searchAnalyticsDTOList = new ArrayList<>();
        for  (SearchAnalytics s : searchAnalytics)
            searchAnalyticsDTOList.add(new SearchAnalyticsDTO(s.getOrigin(), s.getDestination()));

        return searchAnalyticsDTOList;
    }

    @Override
    public List<BookingAnalytics> getUserTopBookings(Long userId) {
        return List.of();
    }
}
