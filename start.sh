#!/bin/bash
# Home Maintenance Planner — start both backend and frontend
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🏠 Home Maintenance Planner"
echo "=========================="

# Start backend
echo "Starting backend on http://localhost:8000..."
cd "$DIR/backend"
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi
python run.py &
BACKEND_PID=$!

# Start frontend
echo "Starting frontend on http://localhost:5173..."
cd "$DIR/frontend"
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ App running at http://localhost:5173"
echo "   Backend API at http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both servers."

cleanup() {
    echo ""
    echo "Shutting down..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "Done."
}

trap cleanup EXIT INT TERM
wait
