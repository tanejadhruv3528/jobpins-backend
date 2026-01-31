# JobPins V2 Database Schema

Minimal PostgreSQL schema supporting the V2 Core Flow only.

## Table: `employers`

Stores employer account information for registration and authentication.

```sql
CREATE TABLE employers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Primary key, auto-incrementing integer
- `email`: Unique email address for login (required, unique constraint)
- `password_hash`: Bcrypt-hashed password (required)
- `company_name`: Company name from registration (required)
- `created_at`: Timestamp when account was created (auto-set)

**Constraints:**
- Email must be unique (prevents duplicate accounts)
- All fields except `created_at` are required

---

## Table: `jobs`

Stores job listings with location data for map display.

```sql
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    employer_id INTEGER NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    latitude NUMERIC(10, 8) NOT NULL,
    longitude NUMERIC(11, 8) NOT NULL,
    apply_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Primary key, auto-incrementing integer
- `employer_id`: Foreign key to `employers.id` (required, links job to employer)
- `title`: Job title (required)
- `description`: Job description text (required)
- `latitude`: Latitude coordinate for map pin (required, precision: -90 to 90)
- `longitude`: Longitude coordinate for map pin (required, precision: -180 to 180)
- `apply_url`: External URL for job application (required)
- `created_at`: Timestamp when job was posted (auto-set)

**Constraints:**
- `employer_id` must reference existing employer (foreign key)
- Deleting an employer deletes all their jobs (CASCADE)
- All fields except `created_at` are required
- Coordinates use NUMERIC for precise decimal storage

---

## Indexes

```sql
-- Index on employer email for fast login lookups
CREATE INDEX idx_employers_email ON employers(email);

-- Index on employer_id for fast job queries by employer
CREATE INDEX idx_jobs_employer_id ON jobs(employer_id);

-- Index on coordinates for potential location-based queries
CREATE INDEX idx_jobs_location ON jobs(latitude, longitude);
```

**Rationale:**
- Email index: Login requires email lookup
- Employer ID index: "View own jobs" query needs this
- Location index: Map queries may filter by location bounds

---

## Notes

- **No soft deletes**: Jobs are permanently deleted (DELETE, not UPDATE)
- **No edit support**: No `updated_at` or versioning fields
- **No job seeker data**: Job seekers remain anonymous (no table needed)
- **Simple timestamps**: `created_at` only, no complex timestamp tracking
- **CASCADE delete**: Removing employer removes all their jobs automatically
