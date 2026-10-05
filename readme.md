# Disaster SOS

### Emergency Response and Location Sharing System

Disaster SOS is an emergency response web application designed to help individuals report emergency situations and share their location with responders during disasters.

The system provides a simple interface for creating an SOS report, capturing the user's location, displaying it on an interactive map, and preparing the emergency information for transmission to the backend.

> **Project Status:** In Development  
> **Project Type:** Final Year Academic Project

---

## Overview

During disasters, quickly communicating an emergency situation and the affected person's location can be difficult.

Disaster SOS aims to provide a simple and user-friendly emergency reporting interface where a user can:

- Trigger an SOS report
- Share their current location
- View their position on an interactive map
- Provide information about the emergency
- Prepare an emergency report for submission
- Send the report to the backend when connectivity is available

The project is designed with a focus on **simplicity, speed, and usability during high-stress situations**.

---

## Key Features

### Emergency SOS Reporting

Users can create an emergency report containing relevant information about the incident.

### Location Detection

The application uses the browser's Geolocation API to obtain:

- Latitude
- Longitude
- Location accuracy

### Interactive Map

The user's location is displayed using:

- Leaflet
- OpenStreetMap

The map automatically centers around the detected location.

### Backend Integration

The frontend is designed to communicate with a FastAPI backend for processing SOS reports.

### Clear Submission Status

The application does not display a fake success message when the backend is unavailable.

If an SOS cannot be transmitted, the report is clearly indicated as:

**Prepared, not sent**

### Responsive Interface

The application is designed to work across desktop and mobile screen sizes.

---

## System Architecture

```text
                    User
                     │
                     ▼
             ┌─────────────────┐
             │  Disaster SOS   │
             │    Frontend     │
             │ React + Vite    │
             └────────┬────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
   Browser Geolocation       Leaflet Map
          │                       │
          └───────────┬───────────┘
                      │
                      ▼
              SOS Report Data
                      │
                      ▼
             ┌─────────────────┐
             │  FastAPI        │
             │    Backend      │
             └────────┬────────┘
                      │
                      ▼
                ┌───────────┐
                │  MySQL    │
                │ Database  │
                └───────────┘