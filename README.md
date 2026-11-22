# EventEase
> **Plan. Manage. Experience.**  
> Modern collegiate event discovery, registration, and administrative lifecycle management platform.

---

## 🌟 Overview

**EventEase** is a full-stack, enterprise-grade Event Management Platform engineered specifically for universities, collegiate institutions, and student organizations. Designed with a clean, light editorial theme, EventEase provides role-based workspaces for **Administrators** (faculty, deans, event organizers) and **Students / Consumers** (event discovery, 1-click booking, pass management).

---

## 🚀 Key Features

### 🎓 Student / Consumer Portal
- **Visual Event Discovery**: Filter events by category (Technical, Cultural, Sports, Workshops, Hackathons), search by keywords, view live seat availability.
- **1-Click Registration**: Instant checkout with auto-filled student profile details.
- **Duplicate & Capacity Guardrails**: Prevents multiple bookings for the same event and enforces seat capacity.
- **My Registrations & Passes**: Interactive registration passes with real-time status (`Confirmed`, `Pending`, `Cancelled`) and self-service seat cancellation.
- **Student Profile Management**: Manage personal contact details, view institutional student ID, and secure password updates.

### 🛡️ Administrative Command Center
- **Executive Analytics**: Live metric cards (Total Events, Registrations, Capacity Utilization, Total Revenue) and interactive charts powered by Recharts.
- **Full Event CRUD**: Create, edit, publish, reschedule, or cancel events with date, time, venue, max capacity, and ticket pricing.
- **Campus-Wide Participant Roster**: Search, filter by event or status, and export participant directories.
- **System Settings & Export**: Backup system data, toggle public registrations, and customize institutional branding.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | Tailwind CSS, React Router v6, Lucide Icons, Recharts, Axios |
| **Backend** | Java 21 + Spring Boot 3.3.5 | Spring Web, Spring Data JPA, Spring Security, BCrypt Hashing, Hibernate 6 |
| **Database** | PostgreSQL & Embedded H2 | PostgreSQL / Supabase ready, persistent local H2 file database fallback |
| **Architecture** | RESTful API | Object-Oriented inheritance (`User` -> `Student`, `Admin`), DTO pattern |

---

## 💻 Local Setup & Running

### Prerequisites
- **Node.js** (v18+)
- **Java 21 LTS** & **Apache Maven 3.9+**

### 1. Clone the Repository
```bash
git clone https://github.com/mukkotiharika777/event-ease.git
cd event-ease
```

### 2. Run the Java Spring Boot Backend
```bash
# Navigate to backend directory
cd backend
mvn spring-boot:run
```
*The backend starts at `http://localhost:8080` with persistent local database storage in `./data/eventease`.*  
*H2 Web Console is available at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/eventease;DB_CLOSE_DELAY=-1;MODE=PostgreSQL`, User: `sa`).*

### 3. Run the React Frontend
```bash
# Navigate to frontend directory
cd ../frontend
npm install
npm run dev
```
*The web client runs at `http://localhost:3000`.*

---

## 🔑 Pre-Seeded Accounts for Testing

| Persona | Role | Email | Password |
| :--- | :--- | :--- | :--- |
| **Dean / Administrator** | `ADMIN` | `admin@eventease.edu` | `Admin@123` |
| **Aarav Sharma (Student)** | `CONSUMER` | `aarav.sharma@college.edu` | `Student@123` |
| **Sneha Patel (Student)** | `CONSUMER` | `sneha.patel@college.edu` | `Student@123` |
| **Rohan Verma (Student)** | `CONSUMER` | `rohan.v@college.edu` | `Student@123` |
| **Student Scholar** | `CONSUMER` | `student@eventease.edu` | `Student@123` |

*You can also create a brand new student account at `/student/register`.*

---

## 📁 Project Structure

```
event-ease/
├── backend/                        # Java 21 Spring Boot Application
│   ├── src/main/java/com/eventease/
│   │   ├── config/                 # SecurityConfig, DataInitializer
│   │   ├── controller/             # REST Endpoints (Auth, Event, Registration, Dashboard)
│   │   ├── dto/                    # Data Transfer Objects
│   │   ├── entity/                 # JPA Entities (User, Student, Admin, Event, Registration)
│   │   ├── repository/             # Spring Data JPA Repositories
│   │   └── service/                # Business Logic Services
│   ├── src/main/resources/         # application.properties
│   └── pom.xml
├── frontend/                       # React + Vite Client
│   ├── src/
│   │   ├── components/layout/      # Public, Student, and Admin Navigation & Layouts
│   │   ├── pages/                  # Views (Home, Explore, Dashboards, Registrations, Forms)
│   │   ├── services/               # Axios API Clients & Mock Failover
│   │   └── App.jsx                 # Role-Based Route Guards
│   ├── tailwind.config.js          # Light Theme Design Tokens
│   └── package.json
├── database/
│   ├── schema.sql                  # PostgreSQL DDL Definitions
│   └── seed.sql                    # Initial Dataset Seeds
└── README.md
```

---

## 📄 License
This project is open-source under the MIT License.
