-- ==============================================================================
-- EVENTEASE — POSTGRESQL RELATIONAL SCHEMA
-- Multi-Role Support: ADMIN and CONSUMER (STUDENT)
-- Tagline: Plan. Manage. Experience.
-- ==============================================================================

DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE (Supports both ADMIN and CONSUMER accounts)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    student_id VARCHAR(50), -- Required for CONSUMER/STUDENT, nullable for ADMIN
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'CONSUMER', -- 'ADMIN' or 'CONSUMER'
    department VARCHAR(150), -- Academic department
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_student_id ON users(student_id);
CREATE INDEX idx_users_role ON users(role);

-- 2. EVENTS TABLE
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- Technology, Workshops, Cultural, Sports, Seminars, Festivals, Other
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    venue VARCHAR(255) NOT NULL,
    organizer VARCHAR(255) NOT NULL,
    max_participants INTEGER NOT NULL CHECK (max_participants > 0),
    registration_fee NUMERIC(10, 2) DEFAULT 0.00 CHECK (registration_fee >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'Upcoming', -- Upcoming, Ongoing, Completed, Cancelled
    image_url VARCHAR(500),
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_event_times CHECK (end_time > start_time)
);

CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_status ON events(status);

-- 3. REGISTRATIONS TABLE
-- Connects events and registered consumer/student accounts
CREATE TABLE registrations (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL, -- Authenticated Consumer Account
    student_name VARCHAR(150) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    registration_status VARCHAR(50) NOT NULL DEFAULT 'Confirmed', -- Confirmed, Pending, Cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Strict constraint: prevent duplicate registration per event
    CONSTRAINT uq_student_event_registration UNIQUE (event_id, student_id),
    CONSTRAINT uq_email_event_registration UNIQUE (event_id, email)
);

CREATE INDEX idx_registrations_event_id ON registrations(event_id);
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_student_id ON registrations(student_id);
CREATE INDEX idx_registrations_status ON registrations(registration_status);
