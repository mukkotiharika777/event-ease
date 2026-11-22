package com.eventease.service;

import com.eventease.dto.EventDto;
import com.eventease.entity.Event;
import com.eventease.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<EventDto> getAllEvents(String category, String status, String search) {
        List<Event> events;
        if (category != null && !category.equalsIgnoreCase("All")) {
            events = eventRepository.findByCategory(category);
        } else if (status != null && !status.equalsIgnoreCase("All")) {
            events = eventRepository.findByStatus(status);
        } else if (search != null && !search.trim().isEmpty()) {
            events = eventRepository.findByEventNameContainingIgnoreCaseOrVenueContainingIgnoreCase(search, search);
        } else {
            events = eventRepository.findAll();
        }

        return events.stream().map(this::toDto).collect(Collectors.toList());
    }

    public EventDto getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + id));
        return toDto(event);
    }

    @Transactional
    public EventDto createEvent(EventDto dto) {
        Event event = new Event(
                dto.getEventName(),
                dto.getDescription(),
                dto.getCategory(),
                dto.getEventDate(),
                dto.getStartTime(),
                dto.getEndTime(),
                dto.getVenue(),
                dto.getOrganizer(),
                dto.getMaxParticipants(),
                dto.getRegistrationFee(),
                dto.getStatus(),
                dto.getImageUrl()
        );
        Event saved = eventRepository.save(event);
        return toDto(saved);
    }

    @Transactional
    public EventDto updateEvent(Long id, EventDto dto) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + id));

        event.setEventName(dto.getEventName());
        event.setDescription(dto.getDescription());
        event.setCategory(dto.getCategory());
        event.setEventDate(dto.getEventDate());
        event.setStartTime(dto.getStartTime());
        event.setEndTime(dto.getEndTime());
        event.setVenue(dto.getVenue());
        event.setOrganizer(dto.getOrganizer());
        event.setMaxParticipants(dto.getMaxParticipants());
        event.setRegistrationFee(dto.getRegistrationFee());
        event.setStatus(dto.getStatus());
        if (dto.getImageUrl() != null) {
            event.setImageUrl(dto.getImageUrl());
        }

        Event updated = eventRepository.save(event);
        return toDto(updated);
    }

    @Transactional
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Event not found with ID: " + id);
        }
        eventRepository.deleteById(id);
    }

    private EventDto toDto(Event e) {
        EventDto dto = new EventDto();
        dto.setId(e.getId());
        dto.setEventName(e.getEventName());
        dto.setDescription(e.getDescription());
        dto.setCategory(e.getCategory());
        dto.setEventDate(e.getEventDate());
        dto.setStartTime(e.getStartTime());
        dto.setEndTime(e.getEndTime());
        dto.setVenue(e.getVenue());
        dto.setOrganizer(e.getOrganizer());
        dto.setMaxParticipants(e.getMaxParticipants());
        dto.setRegistrationFee(e.getRegistrationFee());
        dto.setStatus(e.getStatus());
        dto.setImageUrl(e.getImageUrl());
        return dto;
    }
}
