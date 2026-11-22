package com.eventease.service;

import com.eventease.dto.RegistrationDto;
import com.eventease.entity.Event;
import com.eventease.entity.Registration;
import com.eventease.repository.EventRepository;
import com.eventease.repository.RegistrationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;

    public RegistrationService(RegistrationRepository registrationRepository, EventRepository eventRepository) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
    }

    public List<RegistrationDto> getAllRegistrations(Long eventId, String status) {
        List<Registration> list;
        if (eventId != null) {
            list = registrationRepository.findByEventId(eventId);
        } else {
            list = registrationRepository.findAll();
        }

        if (status != null && !status.equalsIgnoreCase("All")) {
            list = list.stream()
                    .filter(r -> r.getRegistrationStatus().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }

        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<RegistrationDto> getRegistrationsByUser(Long userId, String filter) {
        List<Registration> list = registrationRepository.findByUserId(userId);
        if (filter != null && !filter.equalsIgnoreCase("All")) {
            list = list.stream()
                    .filter(r -> r.getRegistrationStatus().equalsIgnoreCase(filter))
                    .collect(Collectors.toList());
        }
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<RegistrationDto> getRegistrationsByEvent(Long eventId) {
        return registrationRepository.findByEventId(eventId).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public RegistrationDto registerStudent(RegistrationDto dto) {
        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new RuntimeException("Target event not found."));

        if ("Completed".equalsIgnoreCase(event.getStatus()) || "Cancelled".equalsIgnoreCase(event.getStatus())) {
            throw new RuntimeException("Cannot register for an event that is " + event.getStatus().toLowerCase());
        }

        // Prevent duplicate registration for the same event by Student ID or Email
        if (registrationRepository.existsByEventIdAndStudentIdAndRegistrationStatusNot(event.getId(), dto.getStudentId(), "Cancelled")) {
            throw new RuntimeException("You have already reserved a seat for this event with Student ID: " + dto.getStudentId());
        }
        if (registrationRepository.existsByEventIdAndEmailAndRegistrationStatusNot(event.getId(), dto.getEmail(), "Cancelled")) {
            throw new RuntimeException("You have already reserved a seat for this event with Email: " + dto.getEmail());
        }

        // Enforce maximum participant capacity limit
        long confirmed = registrationRepository.countByEventIdAndRegistrationStatus(event.getId(), "Confirmed");
        if (confirmed >= event.getMaxParticipants()) {
            throw new RuntimeException("Event capacity reached. No additional seats are available.");
        }

        Registration reg = new Registration(
                event,
                dto.getUserId(),
                dto.getStudentName(),
                dto.getStudentId(),
                dto.getEmail(),
                dto.getPhone()
        );
        reg.setRegistrationStatus("Confirmed");

        Registration saved = registrationRepository.save(reg);
        return toDto(saved);
    }

    @Transactional
    public RegistrationDto updateStatus(Long id, String status) {
        Registration reg = registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found with ID: " + id));
        reg.setRegistrationStatus(status);
        Registration saved = registrationRepository.save(reg);
        return toDto(saved);
    }

    @Transactional
    public RegistrationDto cancelMyRegistration(Long id) {
        Registration reg = registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found with ID: " + id));
        reg.setRegistrationStatus("Cancelled");
        Registration saved = registrationRepository.save(reg);
        return toDto(saved);
    }

    private RegistrationDto toDto(Registration r) {
        RegistrationDto dto = new RegistrationDto();
        dto.setId(r.getId());
        dto.setEventId(r.getEvent().getId());
        dto.setEventName(r.getEvent().getEventName());
        dto.setUserId(r.getUserId());
        dto.setStudentName(r.getStudentName());
        dto.setStudentId(r.getStudentId());
        dto.setEmail(r.getEmail());
        dto.setPhone(r.getPhone());
        dto.setRegistrationDate(r.getRegistrationDate());
        dto.setRegistrationStatus(r.getRegistrationStatus());
        return dto;
    }
}
