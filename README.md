# CLEAR PATH

This project contains a React Native application (`clear-path`) and a Node.js backend (`backend`).

## Development

To start the development servers for both the frontend and backend with hot reloading, run the following command from the root directory:

```bash
npm run dev
```

This will concurrently start:
- The Expo development server for the React Native app.
- The `nodemon` development server for the backend.

## Database Setup

Before starting the servers, ensure your PostgreSQL database is running via Docker. Instructions for this can be found in `backend/README.md`.

To set up the database schema for the first time, run the following command from the root directory:

```bash
npm run db:setup --prefix backend
