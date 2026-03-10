# Personalized News Feed API

A small end-to-end backend built with **Node.js + Express**, **PostgreSQL + TypeORM**, **Axios** for news ingestion, and **Docker Compose** for local development.

## What it does

- creates users
- stores user topic preferences
- fetches news from an external API using Axios
- falls back to mock articles when no API key is configured
- stores articles in PostgreSQL
- generates a lightweight local summary
- tags articles with topics
- returns a personalized feed
- tracks user interactions like `view`, `click`, or `save`

## Tech stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- TypeORM
- Axios
- Docker Compose

## Project structure

```text
src/
  config/
  controllers/
  entities/
  middleware/
  routes/
  scripts/
  services/
  utils/
```
## POC flow:
News API → Backend → AI summary → Database → User Feed

## System Architecture Diagram
User
   ↓
Frontend
   ↓
Backend API
   ↓
News API
   ↓
AI Summarization
   ↓
Database


## Setup

### 1. Copy environment file

```bash
cp .env.example .env
```

You can leave `NEWS_API_KEY` empty to use mock data.

### 2. Start with Docker Compose

```bash
docker compose up --build
```

API base URL:

```text
http://localhost:3000/api
```

## API endpoints

### Health

```http
GET /api/health
```

### Users

```http
POST /api/users
GET /api/users/:userId
POST /api/users/:userId/topics
```

Example create user body:

```json
{
  "name": "Shradha",
  "email": "shradha@example.com"
}
```

Example set topics body:

```json
{
  "topics": ["AI", "Technology", "Finance"]
}
```

### Topics

```http
GET /api/topics
```

### Articles

```http
POST /api/ingest
GET /api/articles
POST /api/articles/:articleId/summarize
```

### Feed

```http
GET /api/feed?userId=<USER_ID>
```

### Interactions

```http
POST /api/articles/:articleId/interactions
```

Example interaction body:

```json
{
  "userId": "<USER_ID>",
  "interactionType": "click"
}
```

## Suggested Postman flow

### Step 1: create user

```http
POST /api/users
```

### Step 2: assign topics

```http
POST /api/users/:userId/topics
```

### Step 3: ingest news

```http
POST /api/ingest
```

### Step 4: list stored articles

```http
GET /api/articles
```

### Step 5: fetch personalized feed

```http
GET /api/feed?userId=<USER_ID>
```

### Step 6: track article interaction

```http
POST /api/articles/:articleId/interactions
```

## Notes

- This uses `synchronize: true` in TypeORM for fast local setup.
- For production, use proper migrations instead.
- The summarizer is intentionally simple so the full vertical slice works without an LLM key.
- Topic classification is rule-based for speed and clarity.

## Future improvements

- add BullMQ + Redis for async summarization jobs
- replace local summarizer with OpenAI or another provider
- add authentication and JWT
- add pagination and caching
- add full-text search
- move from rule-based ranking to embedding-based ranking
