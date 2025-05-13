 Patient Management Application

This repository contains a **Patient Management Application** built with an **Angular frontend** and an **ASP.NET backend**. The application allows users to manage patient data, including adding, viewing, and deleting patient records.
It is a simple project and given time constraints this serves as an MVP

### There are still tons of works to be done, like a docker-compose file to ease the build of the project, maybe usage of new .Net Aspire could be helpful too
- No update behavior, so, not even a CRUD, just CRD...
- Proper handling of secrets, using Azure KeyVault will be the best, but not for this kind of challange
- A different architecture could be apply, as it is an small app, could be used with MinmalApis, and VerticalSlice architecture. But given the lack of time, I went to what it is the most easy for me
- Lack of Authentication
- Lack of an "Admin" mode, that uses Authorization, so a user can only view patient data, but an admin, edit update, and delete
- Not logical delete on the backend side applied
- Retry policy on the front-end, also some kind of WebSocket with SignalR, to make a refresh on the client after an update on the patient-list
- Another table, like patient-record, with the logs of the medical treatments
- UnitTesting on both apps
- Proper git usage, commit often with proper messages
- And again, tons of work that need to be done at least on my perspective hope you find this somekind of Ok

Personal Note: Give the time constraints, IA was heavily used on the frontend, I needed to correct some mistakes, and make some twist to be able to work, but still a proper review of the code should be done

## Project Overview

### Backend
The backend of this application is built using **ASP.NET Core**. It includes:
- A RESTful API for managing patient data.
- Secure handling of sensitive data, including encryption for fields like SSN.
- Implementation of best practices for API design and error handling.

> **Note:** The backend was developed entirely by me. The encryption of sensitive data, such as SSN, required significant time and effort to learn and implement securely.

### Frontend
The frontend is built using **Angular**. It includes:
- A responsive UI for managing patient records.
- Integration with the backend API for CRUD operations.
- Pagination and validation for better user experience.

> **Note:** Due to the complexity of time constraints, I sought the assistance of **AI** to help build the frontend application. This allowed me to focus on learning and implementing the backend encryption and other critical features.

## Features

### Backend Features
- RESTful API with endpoints for:
  - Adding a new patient.
  - Fetching all patients with pagination.
  - Fetching a single patient by ID.
  - Deleting a patient.
- Data encryption for sensitive fields like SSN.
- Error handling and validation.

### Frontend Features
- Responsive design using **Tailwind CSS**.
- Form validation for adding new patients.
- Pagination for patient lists.
- Integration with the backend API for real-time data updates.

## Technologies Used

### Backend
- **ASP.NET 9**
- **Dapper**
- **SQL Server**
- **Data Encryption**

### Frontend
- **Angular**
- **RxJS**
- **Tailwind CSS**

Frontend: http://localhost:4200
Backend API: http://localhost:5251/swagger
