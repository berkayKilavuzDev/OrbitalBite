﻿# 🍽️ OrbitalBite - Restaurant Order System

![OrbitalBite](https://your-logo-url.com)  
*A modern web-based restaurant ordering system with an interactive menu and real-time cart updates.*

## 📌 Features
- 📋 **Dynamic Menu**: Add, remove, or modify menu items and categories.
- 🛒 **Real-Time Cart**: Customers can customize items and see instant price updates.
- 🚀 **Responsive Design**: Optimized for mobile and desktop usage.
- 🏗️ **Tech Stack**:
  - **Frontend**: React.js, Redux, Bootstrap
  - **Backend**: Django (Django REST Framework)
  - **Database**: PostgreSQL
  - **Authentication**: JWT-based authentication (Django)
  - **Deployment**: Docker

---

## 🛠️ **Installation & Setup**

### ✅ **1. Clone the Repository**
```sh
git clone https://github.com/yourusername/OrbitalBite.git
cd OrbitalBite

## 🛠️ **Installation & Setup**

### ✅ **1. Clone the Repository**
```sh
git clone https://github.com/yourusername/OrbitalBite.git
cd OrbitalBite

Backend Setup (Django)
Create a Virtual Environment & Install Dependencies

cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt

Configure Environment Variables

SECRET_KEY=your_secret_key
DEBUG=True
DATABASE_URL=postgres://your_db_user:your_db_password@localhost:5432/orbitalbite_db

Apply Migrations & Create Superuser

python manage.py migrate
python manage.py createsuperuser

 Start the Django Server

 python manage.py runserver

 Frontend Setup (React)
Install Dependencies
cd ../frontend
npm install

Configure Environment Variables
Create a .env file in the frontend/ directory:
REACT_APP_API_URL=http://127.0.0.1:8000/api

Start the React Development Server

npm start

React frontend should now be running on http://localhost:3000/ 🚀

API Documentation
Once the backend is running, you can view API documentation at:

Swagger UI: http://127.0.0.1:8000/swagger/
DRF Browsable API: http://127.0.0.1:8000/api/   