package org.flynow.repository;

import org.flynow.entity.analytics.BookingAnalytics;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingAnalyticsRepo extends JpaRepository<BookingAnalytics, Long> {
    Page<BookingAnalytics> findByUserId(Long userId, Pageable pageable);
}
