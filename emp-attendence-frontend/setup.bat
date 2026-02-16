@echo off
echo Generating React Frontend Structure...

:: Create main directories
mkdir src\api
mkdir src\components\common
mkdir src\components\attendance
mkdir src\components\charts
mkdir src\components\layout
mkdir src\context
mkdir src\hooks
mkdir src\pages\auth
mkdir src\pages\employee
mkdir src\pages\manager
mkdir src\store
mkdir src\utils

:: Create empty files in api
type nul > src\api\authApi.js
type nul > src\api\attendanceApi.js

:: Create common components
type nul > src\components\common\Navbar.jsx
type nul > src\components\common\Sidebar.jsx
type nul > src\components\common\Button.jsx
type nul > src\components\common\Input.jsx

:: Create Auth pages
type nul > src\pages\auth\Login.jsx
type nul > src\pages\auth\Register.jsx

:: Create Employee pages
type nul > src\pages\employee\Dashboard.jsx
type nul > src\pages\employee\History.jsx
type nul > src\pages\employee\Profile.jsx

:: Create Manager pages
type nul > src\pages\manager\Dashboard.jsx
type nul > src\pages\manager\AllRecords.jsx
type nul > src\pages\manager\Reports.jsx

:: Create Store files
type nul > src\store\authSlice.js
type nul > src\store\attendanceSlice.js

:: Create root level files
type nul > .env
type nul > src\App.jsx
type nul > src\main.jsx

echo Structure created successfully!
pause