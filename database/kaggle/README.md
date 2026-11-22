# Event Recommendation Engine Challenge — Kaggle Dataset Documentation

## 1. Overview
- **Dataset Name**: Event Recommendation Engine Challenge
- **Official Kaggle URL**: [https://www.kaggle.com/competitions/event-recommendation-engine-challenge/data](https://www.kaggle.com/competitions/event-recommendation-engine-challenge/data)
- **Purpose**: Provides real-world event and attendee interaction data used to extract seed events, attendee statuses, and user interaction patterns for EventEase.

---

## 2. Dataset Files & Structure
If downloaded from Kaggle, the following files belong in `database/kaggle/raw/`:
- `events.csv`: Event IDs, creator IDs, start times, location coordinates, country/city, and 100 word-count features (`c_1` to `c_100`).
- `event_attendees.csv`: Event IDs and space-separated user IDs categorized by response (`yes`, `maybe`, `invited`, `no`).
- `users.csv`: User IDs, birth years, genders, join dates, and location information.
- `user_friends.csv`: Social graph representation between users.
- `train.csv` / `test.csv`: User-event recommendation training and test labels.

---

## 3. Preprocessing & Mapping Logic
Because the raw Kaggle dataset was created for machine learning recommendation challenges, it provides timestamps and IDs rather than complete human-readable academic metadata (such as campus venue, ticket fees, or rich event descriptions).

### Source Mapping Strategy:
- **Event Identifiers & Timestamps**: Extracted from `events.csv` (`start_time`, `city`, `state`).
- **Participant Registrations**: Extracted from `event_attendees.csv` by parsing the space-separated user IDs under the `yes` and `maybe` columns into distinct student registrations for the respective event.
- **Attendance Status**:
  - `yes` -> `CONFIRMED`
  - `maybe` -> `PENDING`
  - `invited` -> `INVITED` (or filtered out for active registration lists)

### Synthetic Enrichment:
Missing fields required for a collegiate SaaS portal (Event Name, Description, Department Category, College Venue, Organizer, Capacity, and Status) are populated via deterministic synthetic mapping or demo seeds clearly tagged as `DATA_ORIGIN: SYNTHETIC_ENRICHED`.

---

## 4. Current Status
- Raw Kaggle CSVs are currently **not yet downloaded** into `database/kaggle/raw/`.
- Once placed in `database/kaggle/raw/`, a preprocessing script in Phase 5 will transform them into clean application-ready seeds in `database/kaggle/processed/`:
  - `events_seed.csv`
  - `registrations_seed.csv`
  - `students_seed.csv`
- A deterministic synthetic seed dataset will be used as a standalone demo dataset if raw files are omitted.
