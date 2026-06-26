# 🏥 Patient Appointment Booking System

A full-stack web application that enables patients to register, log in securely, browse available doctors, book appointments, and manage their bookings. Doctors can create and manage appointment slots, while the backend ensures appointment conflicts are prevented.

This project was developed to demonstrate full-stack web development skills, REST API design, authentication, relational database management, and real-world CRUD operations.

---

## 🚀 Features

### Patient

* User Registration & Login
* Secure JWT Authentication
* View Available Doctors
* View Available Appointment Slots
* Book Appointments
* Prevent Double Booking
* View Booking Dashboard

### Doctor

* Create Available Time Slots
* Manage Appointment Availability

### System

* JWT Authentication & Authorization
* RESTful API Architecture
* Appointment Conflict Validation
* MySQL Relational Database
* Responsive React Frontend

---

## 🛠 Tech Stack

### Frontend

* React.js
* React Router
* Axios
* CSS

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt
* REST APIs

### Database

* MySQL

### Tools

* Git
* GitHub
* VS Code

---

## 📂 Project Structure

```
patient-appointment-booking-system/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── tests/
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Abhinavthotakuri1/patient-appointment-booking-system.git
```

```
cd patient-appointment-booking-system
```

---

## Backend Setup

```
cd backend
npm install
```

Create a `.env` file inside the backend folder.

Example:

```
PORT=5000

DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=patient_booking

JWT_SECRET=your_secret_key
```

Start the backend

```
npm start
```

or

```
npm run dev
```

---

## Frontend Setup

```
cd frontend
npm install
npm run dev
```

The frontend runs on

```
http://localhost:5173
```

---

## Database

Create a MySQL database:

```
patient_booking
```

Import the required tables:

* users
* doctors
* appointments
* availability_slots

Update the `.env` file with your MySQL credentials before starting the backend.

---

## API Overview

Authentication

* POST `/api/auth/register`
* POST `/api/auth/login`

Doctors

* GET `/api/doctors`

Appointment Slots

* GET `/api/slots`
* POST `/api/slots`

Appointments

* POST `/api/appointments`
* GET `/api/appointments`

---

## Security

* JWT Authentication
* Password Hashing using bcrypt
* Protected Routes
* Environment Variables
* Input Validation

---

## Future Improvements

* Email Notifications
* Appointment Cancellation
* Rescheduling
* Doctor Profile Management
* Admin Dashboard
* Payment Integration
* Cloud Deployment
* Online Video Consultation

---

## Learning Outcomes

Through this project, I gained hands-on experience with:

* Full-Stack Web Development
* React.js
* Node.js & Express.js
* REST API Development
* MySQL Database Design
* JWT Authentication
* Git & GitHub
* Project Structure and Deployment Workflow

---

## Author

**Abhinav Thotakuri**

GitHub:
https://github.com/Abhinavthotakuri1
