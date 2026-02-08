# Bharat Teeka Portal

A full-stack vaccination management system designed to digitize and streamline the vaccination process across India. The portal enables citizens, hospitals, and administrators to manage vaccination registration, scheduling, and monitoring in a secure and scalable manner.

🚀 Project Overview

The Bharat Teeka Portal is a role-based web application built using Java Spring Boot and React. It supports secure authentication, centralized data management, and smooth interaction between multiple services.

BTP provides a centralized system where:

- Patients register and book vaccination slots
- Parents manage child vaccination
- Hospitals manage vaccine inventory & appointments
- Admin monitors and controls the ecosystem
- Certificates and vaccination records are tracked securely

The system ensures:

Secure user onboarding
Efficient vaccine slot management
Centralized monitoring by administrators
Scalable microservice-oriented backend

🏗️ System Architecture

Frontend: React.js (Single Page Application)
Backend: Spring Boot (Microservice-style services)
Database: Single centralized relational database
Authentication: JWT-based authentication
Communication: RESTful APIs

Backend Services

Auth Service – Authentication, authorization, JWT handling
Patient Service – Citizen registration & beneficiary management
Hospital Service – Hospital onboarding & slot management
Admin Service – System monitoring and approvals

👥 User Roles & Features
🧑 Citizen / Patient

Register and log in securely
Add and manage beneficiaries (self, child, parent)
View hospitals and available vaccine slots
Book vaccination appointments
View vaccination history

🏥 Hospital

Register and get admin approval
Manage vaccine inventory
Create and manage vaccination slots
View registered beneficiaries

🛡️ Admin

Approve or block hospitals and users
Monitor platform activity
Manage system data and configurations

🔐 Security Features

JWT-based authentication and authorization
Role-based access control (RBAC)
Password encryption
Backend validations for sensitive data
Secure REST API communication

🛠️ Tech Stack
Backend

Java
Spring Boot
Spring Security
Spring Data JPA
JWT
Maven

Frontend

React.js
Bootstrap
Axios

Database

MySQL

Tools & Platforms

Git & GitHub
Postman
VS Code / STS

📦 Installation & Setup
Backend Setup
git clone https://github.com/your-username/bharat-teeka-portal.git
cd backend


Configure database credentials in application.properties

Run each Spring Boot service individually

mvn spring-boot:run

Frontend Setup
cd frontend
npm install
npm start

🧪 Testing

Unit Testing
Integration Testing
API Testing using Postman
Manual UI Testing

📌 Key Highlights

Modular and scalable architecture
Clear separation of concerns using multiple services
Secure authentication using JWT
Real-world use-case inspired by national vaccination systems
Clean and responsive UI

📈 Future Enhancements

Email & SMS notifications
OTP-based authentication
Real-time slot availability updates
Analytics dashboard for admin
Mobile application integration
