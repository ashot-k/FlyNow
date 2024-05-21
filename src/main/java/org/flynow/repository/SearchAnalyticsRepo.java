package org.flynow.repository;

import org.flynow.entity.analytics.SearchAnalytics;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SearchAnalyticsRepo extends JpaRepository<SearchAnalytics, Long> {
    Page<SearchAnalytics> findByUserId(Long userId, Pageable pageable);
    Page<SearchAnalytics> findByUserIdOrderByCounterDesc(Long userId, Pageable pageable);
    Page<SearchAnalytics> findByUserIdOrderBySearchTimeDesc(Long userId, Pageable pageable);
    Optional<SearchAnalytics> findByUserIdAndOriginAndDestination(Long userId, String origin, String destination);
}
