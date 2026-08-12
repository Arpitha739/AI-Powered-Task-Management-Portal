# AI-Powered Task Management Portal

## Overview

AI-Powered Task Management Portal is a full-stack web application that enables users to create, manage, and track tasks efficiently. The application includes secure JWT-based authentication, task lifecycle management, and AI-powered task generation using Google Gemini AI. Users can organize their work, prioritize tasks, monitor progress, and leverage AI assistance to automatically generate task descriptions, priorities, and estimated effort.

---

## Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- MySQL
- Maven

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Lucide React Icons

### AI Integration
- Google Gemini API

---

## Architecture Overview

```text
Frontend (React + Vite + Tailwind CSS)
                |
                v
        Axios REST Calls
                |
                v
     Spring Boot REST APIs
                |
                v
    Spring Security + JWT
                |
                v
          Service Layer
                |
                v
        Repository Layer
                |
                v
             MySQL

AI Flow:

React UI
   |
   v
AI Task Request
   |
   v
Spring Boot AI Service
   |
   v
Google Gemini API
   |
   v
Generated Task Details
   |
   v
React Dashboard
```

---

## Features

### Authentication Module
- User Registration
- User Login
- JWT Token Generation
- Protected APIs
- Password Encryption using BCrypt

### Task Management Module
- Create Tasks
- View Tasks
- Edit Tasks
- Delete Tasks
- Update Task Status
  - TODO
  - IN_PROGRESS
  - DONE
- Task Priority Management
  - LOW
  - MEDIUM
  - HIGH
- Due Date Tracking
- Created Timestamp Tracking

### AI Task Assistant
Generate task details using AI:

Input:
- Task Title

Output:
- Task Description
- Suggested Priority
- Estimated Completion Time

Example:

Input:
```text
Prepare client presentation
```

Output:
```text
Description:
Prepare presentation slides for client meeting.

Priority:
HIGH

Estimated Time:
4 Hours
```

### AI Failure Handling
If Gemini API is unavailable, the application returns a fallback response instead of crashing.

---

## Security Features

- JWT Authentication
- Protected Endpoints
- BCrypt Password Hashing
- Environment Variable Support
- User-Specific Task Access
- Input Validation
- Global Exception Handling

---

## Database Schema

### User

| Field | Type |
|---------|---------|
| id | Long |
| name | String |
| email | String |
| password | String |
| createdAt | LocalDateTime |

### Task

| Field | Type |
|---------|---------|
| id | Long |
| title | String |
| description | String |
| priority | Enum |
| status | Enum |
| dueDate | LocalDate |
| estimatedHours | String |
| createdAt | LocalDateTime |
| user | ManyToOne |

Relationship:

```text
User (1)
   |
   |----< Task (Many)
```

---

## API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
```

Request:

```json
{
  "name": "Arpitha",
  "email": "arpitha@gmail.com",
  "password": "Password@123"
}
```

#### Login User

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "arpitha@gmail.com",
  "password": "Password@123"
}
```

---

### Tasks

#### Create Task

```http
POST /api/tasks
```

#### Get All Tasks

```http
GET /api/tasks
```

#### Update Task

```http
PUT /api/tasks/{id}
```

#### Update Task Status

```http
PATCH /api/tasks/{id}/status
```

#### Delete Task

```http
DELETE /api/tasks/{id}
```

---

### AI Assistant

#### Generate Task Using AI

```http
POST /api/ai/generate
```

Request:

```json
{
  "title": "Prepare Java Interview"
}
```

---

## Setup Instructions

### Backend Setup

1. Clone the repository

```bash
git clone <repository-url>
```

2. Open backend project

```bash
cd backend
```

3. Configure environment variables

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
JWT_EXPIRATION
GEMINI_API_KEY
```

4. Run Spring Boot Application

```bash
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

---

### Frontend Setup

1. Open frontend project

```bash
cd frontend
```

2. Install dependencies

```bash
npm install
```

3. Start application

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Validation

### Registration Validation

Password must contain:
- Minimum 8 characters
- One uppercase letter
- One lowercase letter
- One number
- One special character

### Task Validation

- Title cannot be blank

---

## Screenshots

### Login Page
![Login Page](screenshots/login-page.png)

### Registration Page
![Registration Page](screenshots/register-page.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Create Task
![Create Task](screenshots/create-task.png)

### AI Assistant
![AI Assistant](screenshots/ai-assistant.png)

### AI Generated Task
![AI Generated Task](screenshots/ai-assistant-response.png)

### Task Status Update
![Task Status Update](screenshots/edit-task.png)

---

## Challenges Faced

- Implementing JWT Authentication
- Securing AI Endpoints
- Integrating Google Gemini API
- Managing User-Specific Task Access
- Handling Validation and Exceptions
- Connecting Frontend and Backend APIs

---

## Future Enhancements

- Role-Based Access Control
- Pagination
- Search and Filtering
- Task Analytics Dashboard
- Docker Deployment
- Cloud Deployment
- Unit Testing
- Blockchain Audit Trail

---

## Author

Arpitha C

Java Full Stack Developer Intern Assignment
AI-Powered Task Management Portal
