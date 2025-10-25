# Backend Database Setup (PostgreSQL with Docker)

This document outlines the steps to set up and manage the PostgreSQL database for this project using Docker. Using a Docker volume ensures that your database data is persisted even if the container is stopped or removed.

---

### 1. Pull the Specific Docker Image

This command downloads the `postgres:14.19-alpine3.21` image from Docker Hub, which is the specific version used for this project.

```bash
docker pull postgres:14.19-alpine3.21
```

---

### 2. Create a Volume for Data Persistence

This creates a managed Docker volume named `postgres-data`. Your database files will be stored safely in this volume on your host machine, preventing data loss.

```bash
docker volume create postgres-data
```

---

### 3. Run the PostgreSQL Container

This command starts the PostgreSQL container, connects it to the volume you created, and configures it for use.

```bash
docker run -d --name some-postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -p 5432:5432 \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:14.19-alpine3.21
```

**Command Breakdown:**
- `-d`: Runs the container in the background (detached mode).
- `--name some-postgres`: Names your container `some-postgres` for easy reference.
- `-e POSTGRES_PASSWORD=mysecretpassword`: Sets the required password for the `postgres` superuser.
- `-p 5432:5432`: Maps port 5432 on your local machine to port 5432 inside the container.
- `-v postgres-data:/var/lib/postgresql/data`: Mounts the `postgres-data` volume to the directory where Postgres stores its data. **This is crucial for data persistence.**
- `postgres:14.19-alpine3.21`: Specifies the exact Docker image to use.

---

### 4. Set Up the Database Schema

Once the container is running, you can set up the necessary database and table by running the setup script. This only needs to be done once.

From within the `backend` directory, run:
```bash
npm run db:setup
```

This command will:
- Create the `form_submissions` database if it doesn't already exist.
- Create the `submissions` table within the database.

---

### Common Management Commands

Here are the commands you'll need to manage your new container:

**To stop the container:**
```bash
docker stop some-postgres
```

**To start the container again (your data will be preserved):**
```bash
docker start some-postgres
```

**To completely remove the container (this does *not* delete the data volume):**
```bash
# First, stop the container
docker stop some-postgres

# Then, remove it
docker rm some-postgres
```

**To completely remove the container AND all its data (Warning: This is permanent):**
```bash
# Stop and remove the container
docker stop some-postgres
docker rm some-postgres

# Remove the volume (THIS DELETES ALL YOUR DATABASE DATA)
docker volume rm postgres-data
