# Home Maintenance Planner

A local web app that generates a personalized home maintenance schedule based on your home's profile. Built with React + FastAPI + Ollama for AI-powered advice.

Everything runs locally — no cloud, no accounts, no billing.

## What It Does

1. **Home Profile** — Enter your home details: year built, type, systems (HVAC, water heater, roof), features (basement, pool, sprinklers)
2. **Maintenance Plan** — Get a filtered, prioritized task list based on your home. Toggle tasks on/off, adjust frequencies. Visual timeline shows what's due each month.
3. **AI Chat** — Ask questions about your plan using a local LLM (Ollama + Llama 3.1). "Can I skip gutter cleaning?" "What's most urgent for a 30-year-old house?"
4. **Export** — Download your plan as an `.ics` file and import it into Apple Calendar, Google Calendar, or Outlook.

## Screenshots

The app walks you through 4 steps: Profile → Plan → Chat → Export.

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: FastAPI (Python)
- **AI Chat**: Ollama + Llama 3.1 8B (local)
- **State**: Zustand + localStorage (no database)
- **Export**: iCalendar (.ics) generation

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- [Ollama](https://ollama.com) (optional, for AI chat)

### Run

```bash
# Clone and start
git clone https://github.com/rahul031092/home-maintenance-app.git
cd home-maintenance-app
chmod +x start.sh
./start.sh
```

This starts both the backend (http://localhost:8000) and frontend (http://localhost:5173).

### Optional: Enable AI Chat

```bash
brew install ollama
ollama pull llama3.1:8b
ollama serve
```

The app auto-detects whether Ollama is running and shows install instructions if it's not.

## How the Task Engine Works

The backend generates a personalized plan by:

- **Filtering tasks** based on your home: condos skip roof/gutter/siding tasks, homes without attics skip attic inspection, tankless water heaters skip anode rod checks
- **Adjusting frequencies** based on home age: homes 20+ years old get more frequent roof and electrical inspections, newer homes get less frequent HVAC tune-ups
- **Adding tasks** based on features: pools get chemistry checks and winterization, basements get sump pump and moisture checks, sprinkler systems get seasonal testing

## Project Structure

```
home-maintenance-app/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app with CORS
│   │   ├── models.py          # Pydantic models
│   │   ├── task_engine.py     # Filtering + frequency logic
│   │   ├── tasks_data.py      # 27 maintenance tasks
│   │   ├── date_utils.py      # Date scheduling helpers
│   │   ├── ics_export.py      # .ics file generation
│   │   ├── ollama_client.py   # Ollama streaming client
│   │   └── routers/
│   │       ├── plan.py        # POST /api/plan, POST /api/plan/ics
│   │       └── chat.py        # POST /api/chat, GET /api/chat/status
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   └── src/
│       ├── App.tsx
│       ├── components/        # HomeProfileForm, PlanSummary, ChatPanel, etc.
│       ├── store/             # Zustand store
│       └── lib/               # API client, types, localStorage helpers
└── start.sh                   # Launches both servers
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/plan` | Generate maintenance plan from home profile |
| POST | `/api/plan/ics` | Download plan as .ics calendar file |
| GET | `/api/chat/status` | Check if Ollama is available |
| POST | `/api/chat` | Stream AI chat response (SSE) |
