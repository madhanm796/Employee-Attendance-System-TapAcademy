@echo off
echo Starting project setup...

:: 1. Create directories (mkdir in Windows creates parents automatically)
echo Creating directories...
mkdir src\config
mkdir src\controllers
mkdir src\middleware
mkdir src\models
mkdir src\routes
mkdir src\utils
mkdir scripts

:: 2. Create root level files
echo Creating root files...
type nul > .env.example
type nul > .gitignore
type nul > README.md
type nul > server.js

:: 3. Create src files
echo Creating src files...
type nul > src\app.js
type nul > src\config\db.js

:: 4. Create Controller files
type nul > src\controllers\authController.js
type nul > src\controllers\attendanceController.js
type nul > src\controllers\dashboardController.js

:: 5. Create Middleware files
type nul > src\middleware\authMiddleware.js
type nul > src\middleware\roleMiddleware.js

:: 6. Create Model files
type nul > src\models\User.js
type nul > src\models\Attendance.js

:: 7. Create Route files
type nul > src\routes\authRoutes.js
type nul > src\routes\attendanceRoutes.js
type nul > src\routes\dashboardRoutes.js

:: 8. Create Utility files
type nul > src\utils\csvExporter.js
type nul > src\utils\dateHelpers.js

:: 9. Create Script files
type nul > scripts\seed.js

:: 10. Populate .env.example
echo Populating .env.example...
(
echo PORT=5000
echo MONGO_URI=mongodb://localhost:27017/attendance_db
echo JWT_SECRET=your_jwt_secret_key_here
echo NODE_ENV=development
) > .env.example

:: 11. Populate .gitignore
echo Populating .gitignore...
(
echo node_modules/
echo .env
echo .DS_Store
echo coverage/
) > .gitignore

echo Project structure created successfully!
pause