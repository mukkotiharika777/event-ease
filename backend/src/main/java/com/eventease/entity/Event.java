package com.eventease.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String eventName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false, length = 50)
    private String category; // Technical, Workshop, Fest, Cultural, Sports, Seminar, Other

    @Column(nullable = false)
    private LocalDate eventDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false, length = 255)
    private String venue;

    @Column(nullable = false, length = 255)
    private String organizer;

    @Column(nullable = false)
    private int maxParticipants;

    @Column(precision = 10, scale = 2)
    private BigDecimal registrationFee;

    @Column(nullable = false, length = 50)
    private String status; // Upcoming, Ongoing, Completed, Cancelled

    @Column(length = 500)
    private String imageUrl;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Event() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.registrationFee = BigDecimal.ZERO;
        this.status = "Upcoming";
    }

    public Event(String eventName, String description, String category, LocalDate eventDate,
                 LocalTime startTime, LocalTime endTime, String venue, String organizer,
                 int maxParticipants, BigDecimal registrationFee, String status, String imageUrl) {
        this();
        this.eventName = eventName;
        this.description = description;
        this.category = category;
        this.eventDate = eventDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.venue = venue;
        this.organizer = organizer;
        this.maxParticipants = maxParticipants;
        this.registrationFee = registrationFee != null ? registrationFee : BigDecimal.ZERO;
        this.status = status != null ? status : "Upcoming";
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }

    public int getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(int maxParticipants) { this.maxParticipants = maxParticipants; }

    public BigDecimal getRegistrationFee() { return registrationFee; }
    public void setRegistrationFee(BigDecimal registrationFee) { this.registrationFee = registrationFee; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
