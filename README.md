# JobPins

JobPins is a location-first job discovery platform that helps users find jobs based on proximity using an interactive map.

## V1 Summary (Already Built)
The following features are already implemented in V1 using Lovable:

- Interactive Mapbox map with Bangalore locations
- Job pins rendered from location data
- Job list synced with map pins
- Clicking a job highlights its location on the map
- Clicking a map pin highlights related jobs
- Distance calculation from user location with fallback to Bangalore center
- Apply Now CTA linking to external apply URLs
- Bangalore-only dummy job data for testing
- Read-only public launch planned (no public job posting)

V1 is considered complete and frozen.

## V2 Objective
V2 will focus on building a proper backend, employer workflows, and secure data handling, while keeping the map-first job discovery experience.

---

## V2 Plan

**Approach**: Minimal viable backend. Focus on getting real data working, not perfect architecture. Simplify everything possible.

## V2 Core Flow & Boundaries

### The Critical User Flow

V2 must support this single flow, end-to-end:

1. **Employer signs up** → Enters email, password, company name → Account created
2. **Employer logs in** → Enters email and password → Receives access token
3. **Employer posts job** → Enters job title, description, location coordinates, apply URL → Job saved to database
4. **Job appears on map** → Job pin shows on map at specified location → Job appears in job list
5. **Job seeker views map** → Sees job pins and list → Can click to view details
6. **Job seeker applies** → Clicks "Apply Now" → Redirected to external apply URL

This flow must work completely. Nothing else is required for V2.

### V2 WILL Include

**Employer Side:**
- Registration form (email, password, company name)
- Login form (email, password)
- Job posting form (title, description, latitude, longitude, apply URL)
- View list of own posted jobs
- Delete own jobs
- Logout

**Job Seeker Side:**
- View map with all job pins
- View job list
- Click job to see details
- Click "Apply Now" to go to external URL

**Backend:**
- Store employer accounts
- Store job listings
- Authenticate employers
- Serve jobs to public map
- Link jobs to employers

**Frontend:**
- Connect map to real job data
- Simple employer forms
- Existing map and job list from V1

### V2 WILL NOT Include

**Employer Features:**
- Editing jobs after creation (jobs must be deleted and re-posted)
- View analytics or statistics
- Manage profile or settings
- Upload company logo or images
- Multiple user accounts per company
- Password reset or recovery

**Job Seeker Features:**
- Create account or profile
- Save favorite jobs
- Set job alerts or notifications
- Filter or search beyond location
- View application history

**Job Features:**
- Job categories or tags
- Salary information
- Job expiration dates
- Multiple locations per job
- Rich text formatting in descriptions
- Image uploads

**System Features:**
- Email notifications
- SMS notifications
- Payment processing
- Subscription management
- Analytics dashboard
- Admin panel
- API rate limiting beyond basic security
- Job moderation or approval workflow
- Multi-city support (Bangalore only)
- Mobile apps
- AI features of any kind

**Technical Features:**
- Job editing API endpoint
- Password reset endpoints
- Email verification
- OAuth or social login
- File upload handling
- Caching or optimization beyond basics
- Background jobs or queues
- Webhooks or integrations

If it's not in the critical flow above, it's not in V2.

### Problem V2 is Solving

V1 is a read-only prototype with hardcoded dummy data. To make JobPins a real product, we need:

1. **Real Data Storage**: Replace dummy data with a database
2. **Basic API**: Simple endpoints to read and write job data
3. **Employer Access**: Let employers post jobs (minimal auth required)

Without V2, JobPins remains a demo that cannot accept real job postings.

### Goals of V2

1. **Working API**: Simple REST endpoints to read/write jobs from a database
2. **Employer Posting**: Employers can register, login, and post jobs
3. **Basic Security**: Password protection for employer endpoints
4. **Live Deployment**: Backend deployed and frontend connected
5. **Preserve UX**: Keep the map-first discovery experience from V1

### Scope Summary

See "V2 Core Flow & Boundaries" above for complete scope. In brief: employer registration/login, job posting/deletion, public job viewing on map, and basic backend API with database storage.

### High-Level Architecture

```
┌─────────────────┐
│   Frontend (V1) │  React/Next.js (Lovable)
│   Mapbox Map    │  Existing UI preserved
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│   Backend API   │  Node.js + Express
│   - GET /jobs   │  Public: fetch all jobs
│   - POST /jobs  │  Protected: create job
│   - DELETE /job │  Protected: delete own job
│   - Auth        │  JWT tokens
└────────┬────────┘
         │
         │ SQL
         │
┌────────▼────────┐
│   PostgreSQL    │  Supabase (free tier)
│   - jobs table  │  id, title, description, lat, lng, apply_url, employer_id
│   - employers   │  id, email, password_hash, company_name
└─────────────────┘
```

**Tech Stack (Simplified):**
- **Backend**: Node.js + Express (most common, easy to find help)
- **Database**: Supabase PostgreSQL (free tier, easy setup)
- **Supabase Usage**: Supabase is used only as a hosted PostgreSQL database, not for Supabase Auth or client SDKs.
- **Auth**: JWT with bcrypt (standard approach)
- **Hosting**: Railway or Render (simple deployment, free tier)
- **Validation**: Basic checks (required fields, email format)

### Milestones (Approximate Timeline)

#### Week 1: Database & Basic API
- [ ] Set up Node.js + Express project
- [ ] Create Supabase account and database
- [ ] Design simple schema: `jobs` table (id, title, description, lat, lng, apply_url, employer_id, created_at)
- [ ] Design simple schema: `employers` table (id, email, password_hash, company_name, created_at)
- [ ] Implement GET /api/jobs (public, returns all jobs)
- [ ] Test with Postman/curl

**Deliverable**: Public API that returns jobs from database

#### Week 2: Authentication
- [ ] Implement POST /api/auth/register (email, password, company_name)
- [ ] Implement POST /api/auth/login (email, password → returns JWT)
- [ ] Add password hashing with bcrypt
- [ ] Create auth middleware (verify JWT token)
- [ ] Test registration and login flow

**Deliverable**: Employers can register and get JWT tokens

#### Week 3: Job Posting & Management
- [ ] Implement POST /api/jobs (protected, requires JWT)
- [ ] Link jobs to employer_id from JWT
- [ ] Implement GET /api/jobs/my-jobs (protected, returns employer's jobs)
- [ ] Implement DELETE /api/jobs/:id (protected, only own jobs)
- [ ] Add basic validation (required fields, valid coordinates)
- [ ] Test full workflow: register → login → post → view → delete

**Deliverable**: Complete employer job posting workflow

#### Week 4: Frontend Integration & Deployment
- [ ] Update frontend to fetch jobs from GET /api/jobs
- [ ] Build simple login/register form
- [ ] Build simple job posting form
- [ ] Connect map to real API data
- [ ] Deploy backend to Railway/Render
- [ ] Update frontend API URL to production
- [ ] Test end-to-end in production

**Deliverable**: Live V2 with real data, employers can post jobs

---

### Success Criteria

V2 is complete when:
- ✅ Jobs are stored in a database (not hardcoded)
- ✅ Employers can register and log in
- ✅ Employers can post jobs that appear on the map
- ✅ Employers can delete their own jobs
- ✅ Backend is deployed and frontend is connected
- ✅ No dummy data in production
# jobpins-backend
# jobpins-backend
