 # 🕒 Employee Attendance Management System  A production-ready full-stack MERN application built for real-time attendance tracking, featuring automated status detection, managerial analytics, and visual reporting.  ---  ## 👤 Developer Information  * **Name:** [Your Full Name]  * **College:** [Your College Name]  * **Contact Number:** [Your Phone Number]  * **Email:** [Your Email Address]  * **Video Presentation:** [Link to your Demo Video]  ---  ## 🚀 Key Features  ### **Managerial Perspective (Admin Control)**  * **Insights Dashboard:** Real-time analytics including Weekly Attendance Trends (Bar Chart) and Department Distribution (Pie Chart).  * **Live Presence Tracking:** Instant view of "Present" vs "Absent" employees for the current day.  * **Team Calendar:** A visual monthly grid showing attendance density to spot patterns.  * **Advanced Records Management:** Search and filter logs by **Employee ID (e.g., EMP001)**, Name, Date, or Status.  * **Backend CSV Export:** Generate and download filtered reports directly from the server for data integrity.  * **Employee Drill-down:** Detailed historical logs accessible via modals directly from the records table.  ### **Employee Perspective**  * **Real-time Clocking:** Check-in and Check-out functionality with automatic "Late" detection (10:00 AM threshold).  * **Today's Status Widget:** Instant feedback on current clock-in time and personal status.  * **Personal History:** A searchable table of the user's specific attendance records.  * **Official Profile:** Read-only professional profile showing Department, Role, and Employee ID.  ---  ## 🛠 Tech Stack  | Layer | Technology |  | :--- | :--- |  | **Frontend** | React.js (Vite), Tailwind CSS, Lucide Icons |  | **State Management** | Zustand |  | **Charts/Visuals** | Recharts |  | **Backend** | Node.js, Express.js |  | **Database** | MongoDB with Mongoose (ODM) |  | **Authentication** | JSON Web Tokens (JWT) & BcryptJS |  [Image of MERN stack architecture diagram]  ---  ## ⚙️ Setup & Installation Guide  Follow these steps to deploy the project on a new machine for testing.  ### **Prerequisites**  * **Node.js:** v16.x or higher  * **npm:** v8.x or higher  * **MongoDB:** A running local instance or a MongoDB Atlas URI  ### **1. Repository Setup**  ```bash  git clone [Your-GitHub-Repository-URL]  cd [Your-Repository-Name]   `

### **2\. Backend Configuration**

1.  Bashcd server
    
2.  Bashnpm install
    
3.  Code snippetPORT=5000MONGO\_URI=your\_mongodb\_connection\_stringJWT\_SECRET=your\_jwt\_secret\_key\_here
    
4.  Bashnpm start
    

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