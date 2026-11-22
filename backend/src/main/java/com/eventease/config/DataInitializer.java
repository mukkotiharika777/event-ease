package com.eventease.config;

import com.eventease.entity.Admin;
import com.eventease.entity.Event;
import com.eventease.entity.Registration;
import com.eventease.entity.Student;
import com.eventease.repository.EventRepository;
import com.eventease.repository.RegistrationRepository;
import com.eventease.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           EventRepository eventRepository,
                           RegistrationRepository registrationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            // 1. Seed Administrator
            Admin admin = new Admin(
                "Prof. Ramesh Chandra",
                "admin@eventease.edu",
                passwordEncoder.encode("Admin@123"),
                "Dean of Student Affairs",
                "Chief Academic Coordinator"
            );
            admin.setPhone("+91 98765 00001");
            userRepository.save(admin);

            // 2. Seed Distinct Student Accounts
            Student s1 = new Student("Aarav Sharma", "aarav.sharma@college.edu", passwordEncoder.encode("Student@123"), "2023CSB1042", "+91 98765 43210", "Computer Science & Engineering");
            Student s2 = new Student("Sneha Patel", "sneha.patel@college.edu", passwordEncoder.encode("Student@123"), "2023IT1088", "+91 98123 45678", "Information Technology");
            Student s3 = new Student("Rohan Verma", "rohan.v@college.edu", passwordEncoder.encode("Student@123"), "2022EC1031", "+91 97654 32109", "Electronics & Communication");
            Student s4 = new Student("Student Scholar", "student@eventease.edu", passwordEncoder.encode("Student@123"), "2024CSB1100", "+91 98765 11111", "Computer Science");

            userRepository.save(s1);
            userRepository.save(s2);
            userRepository.save(s3);
            userRepository.save(s4);

            // 3. Seed Events
            Event e1 = new Event(
                "ApexHack 2026: 36-Hour National Hackathon",
                "Annual flagship hackathon bringing together top engineering minds to build AI, Web3, and Sustainable Tech solutions with industry mentorship and INR 1.5 Lakhs in cash prizes.",
                "Technical",
                LocalDate.of(2026, 12, 10),
                LocalTime.of(9, 0),
                LocalTime.of(21, 0),
                "APJ Abdul Kalam Innovation Hub, Main Campus",
                "Department of Computer Science & ACM Student Chapter",
                120,
                BigDecimal.ZERO,
                "Upcoming",
                "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"
            );

            Event e2 = new Event(
                "Generative AI & LLM Systems Workshop",
                "Hands-on masterclass covering Retrieval-Augmented Generation (RAG), Fine-Tuning open-weight LLMs, and multi-agent workflows using Python, PyTorch, and Ollama.",
                "Workshop",
                LocalDate.of(2026, 12, 5),
                LocalTime.of(14, 0),
                LocalTime.of(18, 0),
                "Turing Computing Lab, Block B, 3rd Floor",
                "Center for Artificial Intelligence & Robotics",
                60,
                new BigDecimal("150.00"),
                "Upcoming",
                "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80"
            );

            Event e3 = new Event(
                "Tarang 2026 — Annual Inter-Collegiate Cultural Fest",
                "A 3-day vibrant celebration of music, street plays, classical and western dance, battle of the bands, fashion pageants, and celebrity concert nights.",
                "Fest",
                LocalDate.of(2026, 12, 18),
                LocalTime.of(10, 0),
                LocalTime.of(22, 0),
                "Dr. B.R. Ambedkar Open Air Amphitheatre",
                "Student Cultural Council & Arts Guild",
                500,
                BigDecimal.ZERO,
                "Upcoming",
                "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80"
            );

            Event e4 = new Event(
                "State Inter-Collegiate Basketball Tournament",
                "Competitive 5v5 men's and women's tournament featuring 16 universities. Certified university referees and live score broadcasts.",
                "Sports",
                LocalDate.of(2026, 12, 8),
                LocalTime.of(8, 0),
                LocalTime.of(17, 0),
                "University Indoor Sports Arena, Court 1 & 2",
                "Department of Physical Education & Sports Club",
                80,
                BigDecimal.ZERO,
                "Upcoming",
                "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80"
            );

            Event e5 = new Event(
                "Keynote: Future of Quantum Computing & Cryptography",
                "Distinguished research seminar by Dr. Arishta Saxena, IISc fellow, on post-quantum lattice cryptography and quantum supremacy timelines.",
                "Seminar",
                LocalDate.of(2026, 11, 20),
                LocalTime.of(11, 0),
                LocalTime.of(13, 0),
                "Sir C.V. Raman Auditorium",
                "Faculty of Physics & Information Technology",
                200,
                BigDecimal.ZERO,
                "Completed",
                "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80"
            );

            eventRepository.save(e1);
            eventRepository.save(e2);
            eventRepository.save(e3);
            eventRepository.save(e4);
            eventRepository.save(e5);

            // 4. Seed Registrations linked to Events and Students
            registrationRepository.save(new Registration(e1, s1.getId(), s1.getFullName(), s1.getStudentId(), s1.getEmail(), s1.getPhone()));
            registrationRepository.save(new Registration(e1, s2.getId(), s2.getFullName(), s2.getStudentId(), s2.getEmail(), s2.getPhone()));
            registrationRepository.save(new Registration(e2, s3.getId(), s3.getFullName(), s3.getStudentId(), s3.getEmail(), s3.getPhone()));
            registrationRepository.save(new Registration(e2, s1.getId(), s1.getFullName(), s1.getStudentId(), s1.getEmail(), s1.getPhone()));
            registrationRepository.save(new Registration(e3, s2.getId(), s2.getFullName(), s2.getStudentId(), s2.getEmail(), s2.getPhone()));
        }
    }
}
