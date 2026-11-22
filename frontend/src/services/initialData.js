// Deterministic high-quality Indian college event seeds for EventEase
// Matches Section 5 demo criteria: Technical, AI/ML, Coding, Cultural, Sports, Fest

export const INITIAL_EVENTS = [
  {
    id: 1,
    eventName: "ApexHack 2026: 36-Hour National Hackathon",
    description: "Annual flagship hackathon bringing together top engineering minds to build AI, Web3, and Sustainable Tech solutions with industry mentorship and INR 1.5 Lakhs in cash prizes.",
    category: "Technical",
    eventDate: "2026-12-10",
    startTime: "09:00",
    endTime: "21:00",
    venue: "APJ Abdul Kalam Innovation Hub, Main Campus",
    organizer: "Department of Computer Science & ACM Student Chapter",
    maxParticipants: 120,
    registrationFee: 0,
    status: "Upcoming",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-11-01T10:00:00Z"
  },
  {
    id: 2,
    eventName: "Generative AI & LLM Systems Workshop",
    description: "Hands-on masterclass covering Retrieval-Augmented Generation (RAG), Fine-Tuning open-weight LLMs, and multi-agent workflows using Python, PyTorch, and Ollama.",
    category: "Workshop",
    eventDate: "2026-12-05",
    startTime: "14:00",
    endTime: "18:00",
    venue: "Turing Computing Lab, Block B, 3rd Floor",
    organizer: "Center for Artificial Intelligence & Robotics",
    maxParticipants: 60,
    registrationFee: 150,
    status: "Upcoming",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-11-04T12:30:00Z"
  },
  {
    id: 3,
    eventName: "Tarang 2026 — Annual Inter-Collegiate Cultural Fest",
    description: "A 3-day vibrant celebration of music, street plays, classical and western dance, battle of the bands, fashion pageants, and celebrity concert nights.",
    category: "Fest",
    eventDate: "2026-12-18",
    startTime: "10:00",
    endTime: "22:00",
    venue: "Dr. B.R. Ambedkar Open Air Amphitheatre",
    organizer: "Student Cultural Council & Arts Guild",
    maxParticipants: 500,
    registrationFee: 0,
    status: "Upcoming",
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-11-10T15:00:00Z"
  },
  {
    id: 4,
    eventName: "State Inter-Collegiate Basketball Tournament",
    description: "Competitive 5v5 men's and women's tournament featuring 16 universities. Certified university referees and live score broadcasts.",
    category: "Sports",
    eventDate: "2026-12-08",
    startTime: "08:00",
    endTime: "17:00",
    venue: "University Indoor Sports Arena, Court 1 & 2",
    organizer: "Department of Physical Education & Sports Club",
    maxParticipants: 80,
    registrationFee: 0,
    status: "Upcoming",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-11-12T09:00:00Z"
  },
  {
    id: 5,
    eventName: "Keynote: Future of Quantum Computing & Cryptography",
    description: "Distinguished research seminar by Dr. Arishta Saxena, IISc fellow, on post-quantum lattice cryptography and quantum supremacy timelines.",
    category: "Seminar",
    eventDate: "2026-11-20",
    startTime: "11:00",
    endTime: "13:00",
    venue: "Sir C.V. Raman Auditorium",
    organizer: "Faculty of Physics & Information Technology",
    maxParticipants: 200,
    registrationFee: 0,
    status: "Completed",
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-10-25T11:00:00Z"
  },
  {
    id: 6,
    eventName: "Android & Flutter Mobile App Development Bootcamp",
    description: "Two-day intensive workshop building full-stack responsive cross-platform mobile apps using Dart, Flutter 3.x, and Firebase backends.",
    category: "Workshop",
    eventDate: "2026-11-15",
    startTime: "09:30",
    endTime: "16:30",
    venue: "Software Engineering Lab 4",
    organizer: "Google Developer Groups on Campus (GDG)",
    maxParticipants: 50,
    registrationFee: 100,
    status: "Completed",
    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-10-28T14:15:00Z"
  }
];

export const INITIAL_REGISTRATIONS = [
  {
    id: 101,
    eventId: 1,
    eventName: "ApexHack 2026: 36-Hour National Hackathon",
    studentName: "Aarav Sharma",
    studentId: "2023CSB1042",
    email: "aarav.sharma@college.edu",
    phone: "+91 98765 43210",
    registrationDate: "2026-11-05T14:22:10Z",
    registrationStatus: "Confirmed"
  },
  {
    id: 102,
    eventId: 1,
    eventName: "ApexHack 2026: 36-Hour National Hackathon",
    studentName: "Sneha Patel",
    studentId: "2023IT1088",
    email: "sneha.patel@college.edu",
    phone: "+91 98123 45678",
    registrationDate: "2026-11-06T10:15:30Z",
    registrationStatus: "Confirmed"
  },
  {
    id: 103,
    eventId: 2,
    eventName: "Generative AI & LLM Systems Workshop",
    studentName: "Rohan Verma",
    studentId: "2022EC1031",
    email: "rohan.v@college.edu",
    phone: "+91 97654 32109",
    registrationDate: "2026-11-08T16:40:00Z",
    registrationStatus: "Confirmed"
  },
  {
    id: 104,
    eventId: 2,
    eventName: "Generative AI & LLM Systems Workshop",
    studentName: "Ananya Iyer",
    studentId: "2024CSB1102",
    email: "ananya.i@college.edu",
    phone: "+91 96543 21098",
    registrationDate: "2026-11-09T09:12:00Z",
    registrationStatus: "Confirmed"
  },
  {
    id: 105,
    eventId: 3,
    eventName: "Tarang 2026 — Annual Inter-Collegiate Cultural Fest",
    studentName: "Karan Singhania",
    studentId: "2023ME1015",
    email: "karan.s@college.edu",
    phone: "+91 95432 10987",
    registrationDate: "2026-11-12T11:45:00Z",
    registrationStatus: "Confirmed"
  },
  {
    id: 106,
    eventId: 4,
    eventName: "State Inter-Collegiate Basketball Tournament",
    studentName: "Devansh Nair",
    studentId: "2022CE1009",
    email: "devansh.nair@college.edu",
    phone: "+91 94321 09876",
    registrationDate: "2026-11-14T13:20:00Z",
    registrationStatus: "Confirmed"
  },
  {
    id: 107,
    eventId: 1,
    eventName: "ApexHack 2026: 36-Hour National Hackathon",
    studentName: "Pooja Hegde",
    studentId: "2023CSB1059",
    email: "pooja.h@college.edu",
    phone: "+91 93210 98765",
    registrationDate: "2026-11-15T18:05:00Z",
    registrationStatus: "Pending"
  },
  {
    id: 108,
    eventId: 2,
    eventName: "Generative AI & LLM Systems Workshop",
    studentName: "Vikram Malhotra",
    studentId: "2021EE1072",
    email: "vikram.m@college.edu",
    phone: "+91 92109 87654",
    registrationDate: "2026-11-16T15:30:00Z",
    registrationStatus: "Cancelled"
  }
];

export const CATEGORIES = [
  "Technical",
  "Cultural",
  "Sports",
  "Workshop",
  "Seminar",
  "Fest",
  "Other"
];

export const EVENT_STATUSES = [
  "Upcoming",
  "Ongoing",
  "Completed",
  "Cancelled"
];

export const REGISTRATION_STATUSES = [
  "Confirmed",
  "Pending",
  "Cancelled"
];
