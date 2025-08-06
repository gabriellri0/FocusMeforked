#!/bin/bash

# Executa o servidor FastAPI com uvicorn
web: uvicorn main:app --host 0.0.0.0 --port $PORT
