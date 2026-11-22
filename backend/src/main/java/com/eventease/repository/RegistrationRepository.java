package com.eventease.repository;

import com.eventease.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByEventId(Long eventId);
    List<Registration> findByUserId(Long userId);
    List<Registration> findByStudentId(String studentId);
    List<Registration> findByEmail(String email);
    long countByEventIdAndRegistrationStatus(Long eventId, String status);
    boolean existsByEventIdAndStudentIdAndRegistrationStatusNot(Long eventId, String studentId, String status);
    boolean existsByEventIdAndEmailAndRegistrationStatusNot(Long eventId, String email, String status);
}
