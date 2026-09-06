# Recruitment & Applicant Tracker

Task 27 project built to manage job openings and applicants in a recruitment process.

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* Axios
* TanStack Query
* Zustand
* React Hook Form
* Zod
* Lucide React
* CSS

### Backend

* Python
* Flask
* MySQL

## Features

### Dashboard

* View total jobs
* View total applicants
* View open jobs
* View hired applicants
* Applicant status overview

### Jobs

* View jobs
* Search jobs
* Filter jobs by department, type and status
* Reset filters
* Create job
* Edit job
* Delete job
* View job details

### Applicants

* View applicants
* Search applicants
* Filter applicants by status
* Reset filters
* Add applicant
* Update applicant status
* Delete applicant
* View applicant details

### Forms & Validation

* React Hook Form for form handling
* Zod for validation
* Job and applicant form validation

## Project Structure

```text
recruitment-tracker/
│
├── backend/
│   ├── app.py
│   ├── seed.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.ts
│   │   │   ├── jobs.ts
│   │   │   └── applicants.ts
│   │   │
│   │   ├── components/
│   │   │   ├── ApplicantForm.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── JobCard.tsx
│   │   │   ├── JobForm.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── StatusBadge.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useApplicants.ts
│   │   │   └── useJobs.ts
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── JobsPage.tsx
│   │   │   ├── JobDetail.tsx
│   │   │   ├── ApplicantsPage.tsx
│   │   │   └── ApplicantDetail.tsx
│   │   │
│   │   ├── schemas/
│   │   │   └── index.ts
│   │   │
│   │   ├── store/
│   │   │   └── useFilterStore.ts
│   │   │
│   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   ├── App.tsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## API Endpoints

### Jobs

* `GET /api/jobs` - Get jobs
* `GET /api/jobs/<id>` - Get job details
* `POST /api/jobs` - Create job
* `PUT /api/jobs/<id>` - Update job
* `DELETE /api/jobs/<id>` - Delete job

### Applicants

* `GET /api/applicants` - Get applicants
* `GET /api/applicants/<id>` - Get applicant details
* `POST /api/applicants` - Create applicant
* `PUT /api/applicants/<id>/status` - Update applicant status
* `DELETE /api/applicants/<id>` - Delete applicant

### Dashboard

* `GET /api/stats` - Get dashboard statistics

## Running the Project

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend:

```text
http://127.0.0.1:5000
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

## Build

```bash
cd frontend
npm run build
```

Production build completed successfully.

## Status

Task 27 - Recruitment & Applicant Tracker

**Completed**
