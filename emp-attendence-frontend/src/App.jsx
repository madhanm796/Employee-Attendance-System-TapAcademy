import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';

// Layout & Protection
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Employee Pages
import EmployeeDashboard from './pages/employee/Dashboard';
import MyHistory from './pages/employee/History';
import Profile from './pages/employee/Profile';

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard';
import AllRecords from './pages/manager/AllRecords';
import Reports from './pages/manager/Reports';
import TeamCalendar from './pages/manager/TeamCalendar';
import TodayPresence from './pages/manager/TodayPresence';

const App = () => {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route 
          path="/" 
          element={
            user ? (
              <Navigate to={user.role === 'manager' ? '/manager' : '/employee'} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route element={<ProtectedRoute allowedRoles={['employee', 'manager']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/employee" element={<EmployeeDashboard />} />
            <Route path="/employee/history" element={<MyHistory />} />
            <Route path="/employee/profile" element={<Profile />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route path="/manager/records" element={<AllRecords />} />
            <Route path="/manager/today" element={<TodayPresence />} />
            <Route path="/manager/calendar" element={<TeamCalendar />} />
          </Route>
        </Route>

        {/* Error Handling */}
        <Route path="/unauthorized" element={<div className="p-10 text-center">403 - Unauthorized Access</div>} />
        <Route path="*" element={<div className="p-10 text-center">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;