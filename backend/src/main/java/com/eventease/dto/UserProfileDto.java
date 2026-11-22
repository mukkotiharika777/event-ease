package com.eventease.dto;

public class UserProfileDto {
    private Long id;
    private String fullName;
    private String email;
    private String studentId;
    private String phone;
    private String role;
    private String department;

    public UserProfileDto() {}
    public UserProfileDto(Long id, String fullName, String email, String studentId, String phone, String role, String department) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.studentId = studentId;
        this.phone = phone;
        this.role = role;
        this.department = department;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}
