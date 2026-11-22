package com.eventease.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private long totalEvents;
    private long upcomingEvents;
    private long completedEvents;
    private long totalRegistrations;
    private int activeRate;

    public DashboardStatsDto() {}

    public DashboardStatsDto(long totalEvents, long upcomingEvents, long completedEvents, long totalRegistrations, int activeRate) {
        this.totalEvents = totalEvents;
        this.upcomingEvents = upcomingEvents;
        this.completedEvents = completedEvents;
        this.totalRegistrations = totalRegistrations;
        this.activeRate = activeRate;
    }

    public long getTotalEvents() { return totalEvents; }
    public void setTotalEvents(long totalEvents) { this.totalEvents = totalEvents; }

    public long getUpcomingEvents() { return upcomingEvents; }
    public void setUpcomingEvents(long upcomingEvents) { this.upcomingEvents = upcomingEvents; }

    public long getCompletedEvents() { return completedEvents; }
    public void setCompletedEvents(long completedEvents) { this.completedEvents = completedEvents; }

    public long getTotalRegistrations() { return totalRegistrations; }
    public void setTotalRegistrations(long totalRegistrations) { this.totalRegistrations = totalRegistrations; }

    public int getActiveRate() { return activeRate; }
    public void setActiveRate(int activeRate) { this.activeRate = activeRate; }
}
