-- ==============================================================================
-- EVENTEASE — SEED DATASET (DEMO & TESTING RECORDS)
-- ==============================================================================

-- 1. Insert Default Administrator
INSERT INTO users (name, email, password_hash, role, department)
VALUES 
('Prof. Ramesh Chandra', 'admin@eventease.edu', '$2a$12$K8M...demoHashedPassword', 'ADMIN', 'Dean of Student Affairs');

-- 2. Insert Events
INSERT INTO events (id, event_name, description, category, event_date, start_time, end_time, venue, organizer, max_participants, registration_fee, status, image_url)
VALUES 
(1, 'ApexHack 2026: 36-Hour National Hackathon', 'Annual flagship hackathon bringing together top engineering minds to build AI, Web3, and Sustainable Tech solutions with industry mentorship and INR 1.5 Lakhs in cash prizes.', 'Technical', '2026-12-10', '09:00:00', '21:00:00', 'APJ Abdul Kalam Innovation Hub, Main Campus', 'Department of Computer Science & ACM Student Chapter', 120, 0.00, 'Upcoming', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'),
(2, 'Generative AI & LLM Systems Workshop', 'Hands-on masterclass covering Retrieval-Augmented Generation (RAG), Fine-Tuning open-weight LLMs, and multi-agent workflows using Python, PyTorch, and Ollama.', 'Workshop', '2026-12-05', '14:00:00', '18:00:00', 'Turing Computing Lab, Block B, 3rd Floor', 'Center for Artificial Intelligence & Robotics', 60, 150.00, 'Upcoming', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'),
(3, 'Tarang 2026 — Annual Inter-Collegiate Cultural Fest', 'A 3-day vibrant celebration of music, street plays, classical and western dance, battle of the bands, fashion pageants, and celebrity concert nights.', 'Fest', '2026-12-18', '10:00:00', '22:00:00', 'Dr. B.R. Ambedkar Open Air Amphitheatre', 'Student Cultural Council & Arts Guild', 500, 0.00, 'Upcoming', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80'),
(4, 'State Inter-Collegiate Basketball Tournament', 'Competitive 5v5 men''s and women''s tournament featuring 16 universities. Certified university referees and live score broadcasts.', 'Sports', '2026-12-08', '08:00:00', '17:00:00', 'University Indoor Sports Arena, Court 1 & 2', 'Department of Physical Education & Sports Club', 80, 0.00, 'Upcoming', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80'),
(5, 'Keynote: Future of Quantum Computing & Cryptography', 'Distinguished research seminar by Dr. Arishta Saxena, IISc fellow, on post-quantum lattice cryptography and quantum supremacy timelines.', 'Seminar', '2026-11-20', '11:00:00', '13:00:00', 'Sir C.V. Raman Auditorium', 'Faculty of Physics & Information Technology', 200, 0.00, 'Completed', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80');

-- 3. Insert Registrations
INSERT INTO registrations (event_id, student_name, student_id, email, phone, registration_status)
VALUES 
(1, 'Aarav Sharma', '2023CSB1042', 'aarav.sharma@college.edu', '+91 98765 43210', 'Confirmed'),
(1, 'Sneha Patel', '2023IT1088', 'sneha.patel@college.edu', '+91 98123 45678', 'Confirmed'),
(2, 'Rohan Verma', '2022EC1031', 'rohan.v@college.edu', '+91 97654 32109', 'Confirmed'),
(2, 'Ananya Iyer', '2024CSB1102', 'ananya.i@college.edu', '+91 96543 21098', 'Confirmed'),
(3, 'Karan Singhania', '2023ME1015', 'karan.s@college.edu', '+91 95432 10987', 'Confirmed'),
(4, 'Devansh Nair', '2022CE1009', 'devansh.nair@college.edu', '+91 94321 09876', 'Confirmed');
