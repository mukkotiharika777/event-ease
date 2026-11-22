package com.eventease.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "registrations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"event_id", "student_id"}),
    @UniqueConstraint(columnNames = {"event_id", "email"})
})
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "user_id")
    private Long userId; // Linked to authenticated Consumer account

    @Column(nullable = false, length = 150)
    private String studentName;

    @Column(name = "student_id", nullable = false, length = 50)
    private String studentId;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(nullable = false, length = 30)
    private String phone;

    private LocalDateTime registrationDate;

    @Column(nullable = false, length = 50)
    private String registrationStatus; // Confirmed, Pending, Cancelled

    private LocalDateTime createdAt;

    public Registration() {
        this.registrationDate = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.registrationStatus = "Confirmed";
    }

    public Registration(Event event, Long userId, String studentName, String studentId, String email, String phone) {
        this();
        this.event = event;
        this.userId = userId;
        this.studentName = studentName;
        this.studentId = studentId;
        this.email = email;
        this.phone = phone;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }

    public String getRegistrationStatus() { return registrationStatus; }
    public void setRegistrationStatus(String registrationStatus) { this.registrationStatus = registrationStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
