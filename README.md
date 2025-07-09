# Final Project - Asia Hotel Booking System

This project is a full-stack web application for hotel reservations, reviews and a photo gallery.

- **Frontend:** Angular
- **Backend:** Node.js (Express)
- **Database:** MySQL

---

## 📂 Project Structure

```
Final_Project/
│
├── frontend/    # Angular project
└── backend/     # Node + Express server
```

---

## 🚀 How to run the project

### 1️⃣ Clone the repository
```bash
git clone https://github.com/snirpro/Asia.git
cd Final_Project
```

---

## ⚙️ Database Setup

### Import the database
We provide a dump file called `asia_project.sql` which contains the full database schema and initial data.

Run this command in your terminal (make sure `asia_project.sql` is in your current directory):

```bash
..\final_project\backend mysql -u root -p < asia_project.sql
```

When prompted, enter your MySQL password (`1234` if you used the default).

---

### ✅ Check your database
To verify the database was created correctly, log into MySQL:

```bash
mysql -u root -p
```

Then run:

```sql
SHOW DATABASES;
USE asia_project;
SHOW TABLES;
```

You should see tables like `users`, `reviews`, `reservations`, `photos`.

---

## 🏗️ Install and run the application

### 2️⃣ Install backend dependencies
```bash
cd backend
npm install
```

### 3️⃣ Install frontend dependencies
```bash
cd ../frontend
npm install
```

---

## 🔥 Start the application

### Start the backend server
```bash
cd backend
npx nodemon server.js
```
Server will run on:
```
http://localhost:3000
```

### Start the Angular frontend
```bash
cd ../frontend
ng serve
```
Frontend will run on:
```
http://localhost:4200
```

---

## 🛠️ Testing the API
You can use Postman or curl to test the endpoints directly, e.g.:

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"1234"}'
```

---

## ⚡ Exporting your database
If you ever want to create your own dump (for backup or to share with others), run:

```bash
mysqldump -u root -p asia_project > asia_project.sql
```

This will create a `asia_project.sql` file with your full database schema and data.

---

## ✅ Summary
Now you should have:
- MySQL database `asia_project` with all required tables and data.
- Backend running on `http://localhost:3000`.
- Frontend (Angular) running on `http://localhost:4200`.

Enjoy building and customizing your hotel booking system!

