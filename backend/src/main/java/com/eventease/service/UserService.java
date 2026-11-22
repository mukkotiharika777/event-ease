package com.eventease.service;

import com.eventease.dto.AuthRequest;
import com.eventease.dto.AuthResponse;
import com.eventease.dto.RegisterRequest;
import com.eventease.dto.UserProfileDto;
import com.eventease.entity.Student;
import com.eventease.entity.User;
import com.eventease.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse authenticate(AuthRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new RuntimeException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword().trim(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password.");
        }

        String studentId = (user instanceof Student) ? ((Student) user).getStudentId() : null;
        UserProfileDto profile = new UserProfileDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                studentId,
                user.getPhone(),
                user.getRole(),
                user.getDepartment()
        );

        String token = "jwt-session-" + user.getId() + "-" + System.currentTimeMillis();
        return new AuthResponse(token, profile);
    }

    @Transactional
    public UserProfileDto registerConsumer(RegisterRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new RuntimeException("An account with this email already exists.");
        }

        Student student = new Student(
                request.getFullName().trim(),
                cleanEmail,
                passwordEncoder.encode(request.getPassword().trim()),
                request.getStudentId() != null ? request.getStudentId().trim().toUpperCase() : "2024CSB" + (int)(Math.random()*9000 + 1000),
                request.getPhone(),
                request.getDepartment() != null ? request.getDepartment() : "Undergraduate Studies"
        );

        User saved = userRepository.save(student);
        return new UserProfileDto(
                saved.getId(),
                saved.getFullName(),
                saved.getEmail(),
                student.getStudentId(),
                saved.getPhone(),
                saved.getRole(),
                saved.getDepartment()
        );
    }
}
