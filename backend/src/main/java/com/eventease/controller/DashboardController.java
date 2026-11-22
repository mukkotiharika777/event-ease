package com.eventease.controller;

import com.eventease.dto.DashboardStatsDto;
import com.eventease.repository.EventRepository;
import com.eventease.repository.RegistrationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    public DashboardController(EventRepository eventRepository, RegistrationRepository registrationRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats() {
        long totalEvents = eventRepository.count();
        long upcomingEvents = eventRepository.findByStatus("Upcoming").size();
        long completedEvents = eventRepository.findByStatus("Completed").size();
        long totalRegistrations = registrationRepository.count();
        int activeRate = totalEvents > 0 ? (int) Math.round(((double) upcomingEvents / totalEvents) * 100) : 0;

        return ResponseEntity.ok(new DashboardStatsDto(totalEvents, upcomingEvents, completedEvents, totalRegistrations, activeRate));
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics() {
        var monthly = List.of(
            Map.of("month", "Jul", "registrations", 42),
            Map.of("month", "Aug", "registrations", 68),
            Map.of("month", "Sep", "registrations", 95),
            Map.of("month", "Oct", "registrations", 140),
            Map.of("month", "Nov", "registrations", 215),
            Map.of("month", "Dec", "registrations", 280)
        );

        var categories = List.of(
            Map.of("name", "Technical", "value", 12),
            Map.of("name", "Workshop", "value", 8),
            Map.of("name", "Fest", "value", 4),
            Map.of("name", "Cultural", "value", 6),
            Map.of("name", "Sports", "value", 5)
        );

        return ResponseEntity.ok(Map.of(
            "monthlyRegistrations", monthly,
            "categoryDistribution", categories
        ));
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<?> getRecentActivity() {
        var registrations = registrationRepository.findAll();
        int limit = Math.min(5, registrations.size());
        return ResponseEntity.ok(registrations.subList(0, limit));
    }
}
