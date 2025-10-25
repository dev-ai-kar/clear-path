# CLEAR PATH

This project contains a React Native application (`clear-path`) and a Node.js backend (`backend`).

## Development Setup

### 1. Start the Database

This project uses Docker to run a PostgreSQL database and pgAdmin. To start the services, run the following command from the root directory:

```bash
docker-compose up -d
```

### 2. Set Up the Database Schema

Once the container is running, you can set up the necessary database and table by running the setup script. This only needs to be done once.

From within the `backend` directory, run:
```bash
npm run db:setup
```

### 3. Start the Development Servers

To start the development servers for both the frontend and backend with hot reloading, run the following command from the root directory:

```bash
npm run dev
```

This will concurrently start:
- The Expo development server for the React Native app.
- The `nodemon` development server for the backend.
