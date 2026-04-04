# 🔍 HabitLens

> **An intelligent habit-tracking platform powered by AI reflection, photo journalling, and gamified streaks.**

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009879?logo=fastapi)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Container-Docker-2496ed?logo=docker)](https://docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Problem It Solves](#-problem-it-solves)
3. [Target Users (Personas)](#-target-users-personas)
4. [Vision Statement](#-vision-statement)
5. [Key Features / Goals](#-key-features--goals)
6. [Success Metrics](#-success-metrics)
7. [Assumptions & Constraints](#-assumptions--constraints)
8. [MoSCoW Prioritization](#-moscow-prioritization)
9. [Architecture](#-architecture)
10. [Quick Start – Local Development](#-quick-start--local-development)
11. [Branching Strategy](#-branching-strategy)
12. [Local Development Tools](#-local-development-tools)
13. [Folder Structure](#-folder-structure)

---

## 🌟 Project Overview

**HabitLens** is a full-stack progressive web application (PWA) that helps users build and maintain daily habits through AI-generated reflections, photo-based task logging, gamified streaks, and a smart scheduling system. It combines a **Next.js** frontend with a **FastAPI** backend, backed by **PostgreSQL**, all containerized with **Docker**.

---

## 🧩 Problem It Solves

Most habit trackers are either too simplistic (just tick a box) or too complex (overwhelming dashboards). Users lack:
- **Meaningful feedback** on *why* they're succeeding or failing
- **Visual accountability** — no image-based proof of completion
- **Contextual scheduling** — habits not tied to time or effort level
- **AI insight** — no intelligent analysis of patterns over time

HabitLens bridges this gap by making habits *reflective*, *visual*, and *intelligent*.

---

## 👤 Target Users (Personas)

| Persona | Description |
|---|---|
| **The Student** | Manages academic tasks, study schedules, and wants to track focus effort |
| **The Fitness Enthusiast** | Logs workouts and needs photo-proof of gym sessions |
| **The Productivity Seeker** | Uses habit tracking to build routines and measure daily output |
| **The Mindful Individual** | Tracks meditation, water intake, and reflective journalling |

---

## 🎯 Vision Statement

> **"To empower individuals to build meaningful habits by turning daily actions into intelligent, visual, and reflective insights — making self-improvement a measurable and enjoyable journey."**

---

## ✨ Key Features / Goals

- 🔐 **Google OAuth authentication** with JWT session management
- 📋 **Habit & Task management** — create, categorise, schedule, and complete habits with sub-tasks
- 📸 **Photo logging** — upload images as proof of habit completion
- 🤖 **AI Reflection** — Gemini-powered end-of-day summaries and encouragement
- 📅 **Calendar integration** — view habit streaks on a monthly calendar; export to iCal
- 📊 **Analytics dashboard** — effort index, daily score, weekly bar charts
- 🐱 **CatWidget** — a playful gamified companion that reacts to your progress
- 📱 **PWA** — installable, offline-capable, mobile-first design

---

## 📈 Success Metrics

| Metric | Target |
|---|---|
| Daily Active Users (DAU) | 100+ within 3 months of launch |
| Habit completion rate | ≥ 70% for users with 2+ week history |
| Average session duration | > 3 minutes |
| AI reflection engagement | ≥ 60% of users read their daily reflection |
| App crash rate | < 0.5% of sessions |
| Onboarding completion | > 80% of new signups complete first habit |

---

## ⚙️ Assumptions & Constraints

**Assumptions:**
- Users have a Google account for authentication
- Users are primarily on mobile or tablet devices
- Internet connectivity is available for AI reflection generation

**Constraints:**
- Free-tier hosting on Vercel (frontend) and Render (backend) — cold starts possible
- Gemini API rate limits may delay AI reflections under heavy load
- File uploads stored locally (no S3/CDN in initial release)
- Single-region PostgreSQL for MVP

---

## 🎯 MoSCoW Prioritization

### 🔴 Must Have
| # | Feature |
|---|---|
| M1 | User authentication via Google OAuth |
| M2 | Create, edit, and delete habits |
| M3 | Add sub-tasks to habits |
| M4 | Mark habits/tasks as complete for the day |
| M5 | Dashboard showing today's habits |
| M6 | Basic effort scoring system |
| M7 | PostgreSQL persistence for all user data |
| M8 | Secure JWT session management |
| M9 | REST API with FastAPI |
| M10 | Responsive mobile-first UI |

### 🟡 Should Have
| # | Feature |
|---|---|
| S1 | AI-generated daily reflection via Gemini API |
| S2 | Photo upload for habit proof |
| S3 | Calendar view with streak visualization |
| S4 | Weekly analytics bar chart |
| S5 | Habit categories (essential, productivity, recreation, bonus) |
| S6 | Habit credit/effort weighting system |
| S7 | Push notifications / reminders |
| S8 | iCal export of habit schedule |

### 🟢 Could Have
| # | Feature |
|---|---|
| C1 | CatWidget gamified companion |
| C2 | Photo collage / memory feature |
| C3 | Motivational quote of the day |
| C4 | Demo mode (no login required) |
| C5 | Dark / light theme toggle |
| C6 | Friends / social sharing |

### ⚪ Won't Have (this release)
| # | Feature |
|---|---|
| W1 | Native iOS / Android app |
| W2 | Habit marketplace (share habits with community) |
| W3 | Wearable device integration |
| W4 | Multi-language / i18n support |
| W5 | In-app payments or premium tiers |
| W6 | Machine learning habit recommendations |
| W7 | Offline-first full sync (service worker extends coverage only) |

---

## 🏗️ Architecture

The full system architecture is documented in [`architecture.drawio`](./architecture.drawio).
Open it at [app.diagrams.net](https://app.diagrams.net) (File → Open from → Device).

```
┌─────────────────┐       HTTPS/REST       ┌─────────────────┐
│   Next.js 15    │ ─────────────────────> │   FastAPI +     │
│  (Vercel/Docker)│ <───────────────────── │   Uvicorn       │
│  React 19 + TS  │       JSON             │  (Render/Docker)│
└─────────────────┘                        └────────┬────────┘
        │                                           │ SQLAlchemy ORM
        │ Google OAuth                              ▼
        ▼                               ┌─────────────────────┐
┌──────────────┐                        │   PostgreSQL 16      │
│  JWT Tokens  │                        │   (Docker / Render) │
└──────────────┘                        └─────────────────────┘
                                                    │
                                        ┌───────────▼──────────┐
                                        │  External Services    │
                                        │  • Google Gemini API  │
                                        │  • Google OAuth API   │
                                        └──────────────────────┘
```

**Stack Summary:**

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript, TailwindCSS, Framer Motion |
| Backend | FastAPI, Uvicorn, Python 3.11 |
| Database | PostgreSQL 16 via SQLAlchemy ORM |
| Auth | Google OAuth 2.0 + python-jose JWT |
| AI | Google Gemini API |
| Container | Docker, Docker Compose |
| Deploy (Frontend) | Vercel |
| Deploy (Backend) | Render.com |

---

## 🚀 Quick Start – Local Development

### Prerequisites

| Tool | Min Version | Install |
|---|---|---|
| Docker Desktop | 24+ | [docker.com](https://www.docker.com/products/docker-desktop/) |
| Git | 2.x | [git-scm.com](https://git-scm.com) |
| Node.js *(optional – only for running without Docker)* | 20+ | [nodejs.org](https://nodejs.org) |
| Python *(optional – only for running without Docker)* | 3.11+ | [python.org](https://python.org) |

---

### ⚡ Option A — Docker (Recommended)

**1. Clone the repository**
```bash
git clone https://github.com/Arnv-19/HabitLens.git
cd HabitLens
```

**2. Configure environment variables**
```bash
# Copy the template
cp .env.example .env

# Edit .env and fill in your secrets
# (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GEMINI_API_KEY, etc.)
notepad .env   # Windows
# or: nano .env / code .env
```

**3. Build and start all services**
```bash
docker compose up --build
```

**4. Open the app**

| Service | URL |
|---|---|
| 🌐 Frontend | http://localhost:3000 |
| ⚙️ Backend API | http://localhost:8000 |
| 📖 API Docs (Swagger) | http://localhost:8000/docs |
| 🗄️ Database | localhost:5432 |

**5. Stop everything**
```bash
docker compose down
```

**To reset the database volume:**
```bash
docker compose down -v
```

---

### 🔧 Option B — Manual (Without Docker)

**Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt

# Set up .env in backend/ with DATABASE_URL pointing to your local Postgres
uvicorn app.main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
# Set NEXT_PUBLIC_API_URL=http://localhost:8000 in frontend/.env.local
npm run dev
```

---

## 🌿 Branching Strategy

HabitLens follows **GitHub Flow** — a lightweight, single-main-branch workflow ideal for continuous delivery.

### Rules

| Branch | Purpose |
|---|---|
| `main` | Always production-ready; protected branch |
| `feature/<name>` | New features (e.g. `feature/auth`, `feature/ai-reflection`) |
| `fix/<name>` | Bug fixes (e.g. `fix/calendar-streak`) |
| `chore/<name>` | Housekeeping (e.g. `chore/docker-setup`) |

### Workflow

```
1.  Branch off main:    git checkout -b feature/your-feature
2.  Commit changes:     git commit -m "feat: describe the change"
3.  Push branch:        git push origin feature/your-feature
4.  Open a Pull Request on GitHub
5.  Review + CI checks pass
6.  Merge into main & delete branch
```

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` — new feature
- `fix:` — bug fix
- `chore:` — maintenance / tooling
- `docs:` — documentation
- `refactor:` — code restructuring without behaviour change

---

## 🛠️ Local Development Tools

| Tool | Version | Purpose |
|---|---|---|
| **VS Code** | Latest | Primary IDE with TypeScript and Python extensions |
| **Docker Desktop** | 24+ | Containerised local environment |
| **Node.js** | 20 LTS | Frontend runtime (Next.js, npm) |
| **Python** | 3.11+ | Backend runtime (FastAPI, SQLAlchemy) |
| **PostgreSQL** | 16 | Relational database (via Docker) |
| **Git** | 2.x | Version control |
| **Postman / Swagger UI** | — | API testing (available at `/docs`) |

### VS Code Recommended Extensions

```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.vscode-pylance",
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-azuretools.vscode-docker",
    "eamodio.gitlens"
  ]
}
```

---

## 📁 Folder Structure

```
HabitLens/
├── backend/                  # FastAPI Python backend
│   ├── app/
│   │   ├── core/             # Config, security helpers
│   │   ├── database/         # SQLAlchemy models & engine
│   │   ├── routes/           # API route handlers
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   ├── services/         # Business logic (AI, image, iCal)
│   │   ├── utils/            # Utility functions
│   │   └── main.py           # FastAPI app entry point
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/                 # Next.js 15 frontend
│   ├── app/                  # App Router pages
│   │   ├── dashboard/
│   │   ├── calendar/
│   │   ├── stats/
│   │   ├── settings/
│   │   └── demo/
│   ├── components/           # Reusable React components
│   │   ├── habit/
│   │   ├── stats/
│   │   └── ui/
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # API client utilities
│   ├── styles/               # Global CSS
│   ├── public/               # Static assets
│   ├── Dockerfile
│   └── package.json
│
├── architecture.drawio       # System architecture diagram
├── docker-compose.yml        # Local orchestration
├── .env.example              # Environment variable template
├── .gitignore
└── README.md
```

---

## 📄 License

MIT © 2026 Arnav
