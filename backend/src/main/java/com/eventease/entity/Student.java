package com.eventease.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/**
 * Student / Consumer entity inheriting from User.
 * Demonstrates OOP Inheritance and Specialization.
 */
@Entity
@Table(name = "students")
public class Student extends User {

    @Column(nullable = false, unique = true, length = 50)
    private String studentId; // Institutional Roll Number / Student ID

    private int rewardPoints;

    public Student() {
        super();
        setRole("CONSUMER");
    }

    public Student(String fullName, String email, String passwordHash, String studentId, String phone, String department) {
        super(fullName, email, passwordHash, "CONSUMER", department);
        this.studentId = studentId;
        setPhone(phone);
    }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public int getRewardPoints() { return rewardPoints; }
    public void setRewardPoints(int rewardPoints) { this.rewardPoints = rewardPoints; }
}
