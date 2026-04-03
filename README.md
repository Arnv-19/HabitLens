# 🔍 HabitLens

> Track habits, build streaks, and see your day unfold — with photo collages, analytics, and AI-powered reflections.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.11x-green)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

---

## 📌 Project Overview

**HabitLens** is a premium, mobile-first habit tracking platform that helps users build and maintain consistent daily routines. Unlike generic to-do apps, HabitLens introduces a unique **Effort Index** scoring system, daily **photo collages** as visual proof of habits, and AI-generated **daily reflections** — all wrapped in a sleek dark UI.

---

## 🧩 Problem it Solves

Most habit trackers are either too simple (just checkboxes) or too complex (overwhelming analytics). They lack:
- **Visual accountability** — no way to *see* your day's effort
- **Flexible scoring** — not all habits are equal
- **Motivational feedback** — no personalized insights

HabitLens solves all three by combining gamified scoring, photo evidence, and heuristic reflections.

---

## 👥 Target Users (Personas)

| Persona | Description |
|---------|-------------|
| 🎓 **The Student** | Tracks study sessions, lectures, and exam prep; needs streaks to stay motivated |
| 💪 **The Fitness Enthusiast** | Logs workouts, hydration, and sleep; wants visual proof of consistency |
| 🧘 **The Mindful Professional** | Balances work and wellness; needs a calm, distraction-free tracker |
| 📱 **The Mobile-First User** | Primarily uses phone; needs a PWA that feels native |

---

## 🎯 Vision Statement

> *"To be the habit tracker that makes your daily efforts visible, meaningful, and worth celebrating — one day at a time."*

---

## ✨ Key Features / Goals

| Feature | Description |
|---------|-------------|
| 📊 **Effort Index** | Proprietary score: `Credit × (Tasks Done / Total Tasks) × (Effort% / 100)` |
| 📸 **Daily Photo Collage** | Upload photos per habit; auto-generates a daily visual collage |
| 🔥 **Streaks** | Consecutive-day tracking with visual indicators |
| 🤖 **AI Reflection** | Heuristic daily insights based on performance tiers |
| 📅 **Calendar Integration** | ICS import; view habit tasks alongside calendar events |
| 🌙 **Midnight Auto-reset** | Tasks reset at midnight; photos cleaned up automatically |
| 📱 **PWA** | Installable on mobile; works offline for basic features |
| 👤 **Guest Mode** | Try all features without signup; data stored locally |
| 🔐 **Google OAuth** | One-click sign-in; JWT-secured API |

---

## 📈 Success Metrics

- **Day-7 retention rate** ≥ 40%
- **Average habits per active user** ≥ 4
- **Photo uploads per active user** ≥ 1/week
- **Streak ≥ 7 days** achieved by 25% of users within first month
- **Effort Index > 50%** on at least 5 out of 7 days per week (active users)

---

## ⚠️ Assumptions & Constraints

**Assumptions:**
- Users have access to a smartphone with a camera
- Google OAuth credentials are available for auth
- PostgreSQL is available in the deployment environment
- Users are motivated to track habits daily

**Constraints:**
- Free-tier Figma limits advanced prototyping features
- Image storage in DB (base64) — suitable for MVP, not for scale
- No native mobile app — PWA only
- AI reflection uses heuristics (not LLM) to avoid API costs

---

## 🗂️ Folder Structure

```
habitlens/
├── backend/
│   ├── app/
│   │   ├── core/          # Config, security
│   │   ├── database/      # Models, DB session
│   │   ├── routes/        # API route handlers
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   └── utils/         # JWT, image, ICS utils
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/               # Next.js App Router pages
│   ├── components/        # Reusable UI components
│   │   ├── habit/
│   │   ├── stats/
│   │   └── ui/
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # API client, auth context
│   ├── styles/            # Global CSS
│   ├── public/            # Static assets, PWA manifest
│   └── Dockerfile
├── design/                # Architecture diagrams, Figma exports
├── docs/                  # Additional documentation
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🏗️ Architecture Overview

HabitLens follows a **Client-Server (3-tier)** architecture:

```
[Next.js PWA (Vercel)]
         │
         │ HTTPS REST API
         ▼
[FastAPI Backend (Render)]
         │
         │ SQLAlchemy ORM
         ▼
[PostgreSQL Database (Supabase/Render)]
```

**Technology Stack:**

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Framer Motion, Chart.js |
| Backend | FastAPI (Python), SQLAlchemy, Pydantic |
| Database | PostgreSQL 16 |
| Auth | Google OAuth 2.0 + JWT (python-jose) |
| Image Processing | Pillow (PIL) |
| Deployment | Docker, Vercel (FE), Render (BE) |

---

## 🌿 Branching Strategy (GitHub Flow)

We follow **GitHub Flow** — a lightweight, branch-based workflow:

```
main  ──────●──────────────────●─────────────●──────▶
            │                  ▲             ▲
            └─ feature/auth ───┘             │
                               │             │
                 feature/habit-scoring ──────┘
```

**Rules:**
1. `main` is always deployable
2. All work happens on **feature branches** named `feature/<description>`
3. Open a **Pull Request** to merge into `main`
4. Squash-merge after at least 1 review
5. Delete branch after merge

**Branch naming convention:**
- `feature/habit-scoring` — new feature
- `fix/photo-upload-bug` — bug fix
- `chore/update-deps` — maintenance

---

## 🚀 Quick Start — Local Development

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- [Node.js 20+](https://nodejs.org/) (for local frontend dev)
- [Python 3.11+](https://www.python.org/) (for local backend dev)
- A Google OAuth Client ID ([create one here](https://console.cloud.google.com/))

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/habitlens.git
cd habitlens
```

### 2. Set up environment variables

Create `backend/.env`:
```env
DATABASE_URL=postgresql://habitlens:habitlens@db:5432/habitlens
JWT_SECRET=your-super-secret-key-change-in-production
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GMAIL_USER=your-gmail@gmail.com
GMAIL_PASSWORD=your-app-password
ENVIRONMENT=development
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

### 3. Run with Docker Compose

```bash
docker-compose up --build
```

This starts:
- **Frontend** → http://localhost:3000
- **Backend API** → http://localhost:8000
- **API Docs** → http://localhost:8000/docs
- **PostgreSQL** → localhost:5432

### 4. (Optional) Run services individually

**Backend only:**
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend only:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🐳 Docker Setup

**`docker-compose.yml`** (place in repo root):

```yaml
version: '3.9'

services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: habitlens
      POSTGRES_PASSWORD: habitlens
      POSTGRES_DB: habitlens
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    env_file: ./backend/.env
    ports:
      - "8000:8000"
    depends_on:
      - db
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    env_file: ./frontend/.env.local
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  pgdata:
```

**`backend/Dockerfile`:**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**`frontend/Dockerfile`:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

---

## 🛠️ Local Development Tools

| Tool | Purpose | Version |
|------|---------|---------|
| VS Code | Primary IDE | Latest |
| Docker Desktop | Container management | 4.x |
| Postman / Bruno | API testing | Latest |
| pgAdmin / TablePlus | Database GUI | Latest |
| Node.js | Frontend runtime | 20 LTS |
| Python | Backend runtime | 3.11+ |
| Git | Version control | 2.x |

---

## 🎨 Software Design

See [design/](./design/) folder for architecture diagrams and Figma exports.

**Main design choices:**
- **Layered architecture** separates routes → services → database for low coupling and high cohesion
- **Service layer** encapsulates all business logic (scoring, collage generation, reflection)
- **Pydantic schemas** enforce strict input/output contracts between API and clients

---

## 📚 API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Key endpoints:

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/auth/google` | Google OAuth login |
| GET | `/habits` | List all habits |
| POST | `/habits` | Create habit |
| POST | `/dashboard/habit-log` | Log habit completion |
| GET | `/dashboard` | Today's stats |
| GET | `/dashboard/weekly` | 7-day effort data |
| POST | `/collage/upload-photo` | Upload habit photo |
| POST | `/collage/generate` | Generate daily collage |
| GET | `/reflection/today` | AI daily reflection |

---

## 👨‍💻 Contributors
@Kaivalya Vaidya

Built with ❤️ for better habits.
