package com.eventease.repository;

import com.eventease.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCategory(String category);
    List<Event> findByStatus(String status);
    List<Event> findByEventNameContainingIgnoreCaseOrVenueContainingIgnoreCase(String name, String venue);
}
