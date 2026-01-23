import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import CreateAccount from '../pages/registration/CreateAccount.jsx';
import PersonalInfo from '../pages/registration/PersonalInfo.jsx';

// Import dashboard components (make sure these exist)
import AdminDashboard from '../pages/dashboard/AdminDashboard.jsx';
import HospitalDashboard from '../pages/dashboard/HospitalDashboard.jsx';
import PatientDashboard from '../pages/dashboard/PatientDashboard.jsx';
import ParentDashboard from '../pages/dashboard/ParentDashboard.jsx';

function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<CreateAccount />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/personal-info" element={<PersonalInfo />} />
      
      {/* Protected routes - all logged in users */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <div>General Dashboard</div>
        </ProtectedRoute>
      } />
      
      {/* Test route without protection */}
      <Route path="/test-dashboard" element={<AdminDashboard />} />
      
      {/* Protected routes with role check */}
      <Route path="/admin-dashboard" element={
        <ProtectedRoute allowedRoles={[1]}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/hospital-dashboard" element={
        <ProtectedRoute allowedRoles={[2]}>
          <HospitalDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/patient-dashboard" element={
        <ProtectedRoute allowedRoles={[3]}>
          <PatientDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/parent-dashboard" element={
        <ProtectedRoute allowedRoles={[4]}>
          <ParentDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default AppRouter;