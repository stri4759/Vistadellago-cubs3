#!/bin/bash

cd club-directory-api

echo "Starting backend API on localhost:8080..."
python main.py &
BACKEND_PID=$!

sleep 3

echo "Starting frontend server on 0.0.0.0:${PORT:-5000}..."
python frontend/server.py &
FRONTEND_PID=$!

wait $BACKEND_PID $FRONTEND_PID
