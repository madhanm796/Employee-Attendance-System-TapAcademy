# 🕒 Employee Attendance Management System

A production-ready full-stack **MERN** application built for real-time attendance tracking, featuring automated status detection, managerial analytics, and visual reporting.

---

## 👤 Developer Information

- **Name:** [Your Full Name]  
- **College:** [Your College Name]  
- **Contact Number:** [Your Phone Number]  
- **Email:** [Your Email Address]  
- **Video Presentation:** [Link to your Demo Video]

---

## 🚀 Key Features

### 👨‍💼 Managerial Perspective (Admin Control)

- **Insights Dashboard**
  - Weekly Attendance Trends (Bar Chart)
  - Department Distribution (Pie Chart)

- **Live Presence Tracking**
  - Real-time view of **Present vs Absent** employees

- **Team Calendar**
  - Monthly attendance grid for pattern recognition

- **Advanced Records Management**
  - Filter by:
    - Employee ID (`EMP001`)
    - Name
    - Date
    - Status

- **Backend CSV Export**
  - Securely generate and download filtered reports

- **Employee Drill-down**
  - Detailed historical attendance logs via modal view

---

### 👨‍💻 Employee Perspective

- **Real-time Clocking**
  - Check-in / Check-out
  - Automatic **Late detection** (after 10:00 AM)

- **Today's Status Widget**
  - Instant display of attendance state

- **Personal Attendance History**
  - Searchable personal records table

- **Official Profile**
  - Department
  - Role
  - Employee ID

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React.js (Vite), Tailwind CSS, Lucide Icons |
| **State Management** | Zustand |
| **Charts / Visualization** | Recharts |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose (ODM) |
| **Authentication** | JWT & BcryptJS |

---

## 🏗 MERN Architecture Overview

 `

### 2. Backend Configuration

**Navigate to the server directory:**
```bash
cd emp-attendance-backend
npm install
```

### **3\. Frontend Configuration**

1.  Bashcd client
    
2.  Bashnpm install
    
3.  Code snippetVITE\_API\_BASE\_URL=http://localhost:5000/api
    
4.  Bashnpm run dev
    

📁 Project Structure
--------------------
  ├── client/                # React Frontend  │   ├── src/  │   │   ├── api/           # Axios service layers  │   │   ├── components/    # Reusable UI (Modals, Charts, Stats)  │   │   ├── pages/         # Feature-specific pages (Dashboard, Calendar)  │   │   └── store/         # Zustand Auth store  ├── server/                # Node.js Backend  │   ├── controllers/       # Business logic (Auth, Attendance)  │   ├── models/            # Mongoose Schemas (User, Attendance)  │   ├── routes/            # Express Endpoints  │   └── utils/             # Date processing & CSV generation   `

🧪 Credentials for Testing
--------------------------

### **Manager Account**

*   **Email:** admin@company.com (or your seeded admin email)
    
*   **Password:** admin123
    

### **Employee Account**

*   **Email:** user@company.com
    
*   **Password:** user123
    
*   **Employee ID:** EMP001 (Use this in the Manager filter to test ID searching)
    

🛡 Security & Design Standards
------------------------------

*   **Stateless Auth:** Secure session handling using JWT.
    
*   **Relational Schema:** Efficient data linking using MongoDB ObjectIds and .populate().
    
*   **Clean Code:** Modular component architecture for scalability and readability.
    
*   **UX Focused:** Responsive layouts with loading skeletons and color-coded status badges.