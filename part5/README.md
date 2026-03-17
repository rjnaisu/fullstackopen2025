# Part 5 Blog List App

This repository contains two applications:

- `blogs`: Express + MongoDB backend
- `bloglist-frontend`: React + Vite frontend

## Project Structure

```text
part5/
├── blogs/
└── bloglist-frontend/
```

## Prerequisites

- Node.js installed
- MongoDB available
- A running MongoDB database, either:
  - locally on your machine, or
  - remotely through a connection string

## Install Dependencies

Install dependencies in both apps.

Backend:

```bash
cd blogs
npm install
```

Frontend:

```bash
cd bloglist-frontend
npm install
```

## Backend Environment Variables

Create a `.env` file inside [`/Users/rjnais/projects/fullstackopen2025/part5/blogs`](/Users/rjnais/projects/fullstackopen2025/part5/blogs) with at least:

```env
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/bloglist
SECRET=replace-this-with-a-real-secret
TEST_MONGODB_URI=mongodb://127.0.0.1:27017/bloglist_test
```

Notes:

- `PORT` is used by the backend server.
- `MONGODB_URI` is used in development and production.
- `TEST_MONGODB_URI` is used when running backend tests.
- `SECRET` is required for JWT login tokens.

## Start MongoDB

If you use a local MongoDB instance, start it before the backend.

Typical options are:

```bash
mongod
```

or, if you installed MongoDB as a service, start it with your platform's service manager.

If you use MongoDB Atlas or another remote database, make sure `MONGODB_URI` points to that database and no local MongoDB process is needed.

## Run The Application In Development

Open two terminals.

### 1. Start the backend

From [`/Users/rjnais/projects/fullstackopen2025/part5/blogs`](/Users/rjnais/projects/fullstackopen2025/part5/blogs):

```bash
npm run dev
```

This runs the backend with:

```bash
cross-env NODE_ENV=development node --watch index.js
```

By default, the frontend dev server proxies `/api` requests to `http://localhost:3001`, so `PORT=3001` is the expected local setup.

### 2. Start the frontend

From [`/Users/rjnais/projects/fullstackopen2025/part5/bloglist-frontend`](/Users/rjnais/projects/fullstackopen2025/part5/bloglist-frontend):

```bash
npm run dev
```

This starts the Vite development server. Open the URL shown in the terminal, which is usually:

```text
http://localhost:5173
```

## Optional Backend Commands

From [`/Users/rjnais/projects/fullstackopen2025/part5/blogs`](/Users/rjnais/projects/fullstackopen2025/part5/blogs):

Seed the development database:

```bash
npm run seed:dev
```

Run tests:

```bash
npm test
```

Start the backend in production mode:

```bash
npm start
```

## Optional Frontend Commands

From [`/Users/rjnais/projects/fullstackopen2025/part5/bloglist-frontend`](/Users/rjnais/projects/fullstackopen2025/part5/bloglist-frontend):

Build the frontend:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

## Development Flow Summary

1. Start MongoDB, unless you are using a remote database.
2. In `blogs`, create `.env` and run `npm run dev`.
3. In `bloglist-frontend`, run `npm run dev`.
4. Open the frontend in the browser.
