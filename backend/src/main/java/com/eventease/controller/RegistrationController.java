package com.eventease.controller;

import com.eventease.dto.RegistrationDto;
import com.eventease.service.RegistrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "*")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @GetMapping
    public ResponseEntity<List<RegistrationDto>> getAllRegistrations(
            @RequestParam(required = false) Long eventId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(registrationService.getAllRegistrations(eventId, status));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<RegistrationDto>> getByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(registrationService.getRegistrationsByEvent(eventId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RegistrationDto>> getByUser(@PathVariable Long userId,
                                                           @RequestParam(required = false, defaultValue = "All") String filter) {
        return ResponseEntity.ok(registrationService.getRegistrationsByUser(userId, filter));
    }

    @PostMapping
    public ResponseEntity<?> register(@RequestBody RegistrationDto dto) {
        try {
            RegistrationDto result = registrationService.registerStudent(dto);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<RegistrationDto> updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        String status = body.getOrDefault("registrationStatus", "Confirmed");
        return ResponseEntity.ok(registrationService.updateStatus(id, status));
    }

    @DeleteMapping("/my/{id}")
    public ResponseEntity<RegistrationDto> cancelMyRegistration(@PathVariable Long id) {
        return ResponseEntity.ok(registrationService.cancelMyRegistration(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRegistration(@PathVariable Long id) {
        return ResponseEntity.ok(registrationService.cancelMyRegistration(id));
    }
}
