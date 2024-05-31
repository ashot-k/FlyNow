package org.flynow.service;

import io.micrometer.core.instrument.search.Search;
import org.flynow.dto.BookingAnalyticsDTO;
import org.flynow.dto.SearchAnalyticsDTO;
import org.flynow.entity.analytics.BookingAnalytics;
import org.flynow.entity.analytics.SearchAnalytics;

import java.util.List;

public interface AnalyticsService {
     SearchAnalytics saveSearchAnalytics(SearchAnalyticsDTO searchAnalytics);
     BookingAnalytics saveBookingAnalytics(BookingAnalyticsDTO bookingAnalytics);
     List<SearchAnalyticsDTO> getUserRecentSearches(Long userId);
     List<BookingAnalytics> getUserTopBookings(Long userId);
}
