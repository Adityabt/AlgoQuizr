import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Landing       from "../pages/Landing/Landing";
import Login         from "../pages/Login/Login";
import Signup        from "../pages/Signup/Signup";
import Dashboard     from "../pages/Dashboard/Dashboard";
import Quiz          from "../pages/Quiz/Quiz";
import Progress      from "../pages/Progress/Progress";
import Settings      from "../pages/Settings/Settings";
import Practice      from "../pages/Practice/Practice";
import Profile       from "../pages/Profile/Profile";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword  from "../pages/ResetPassword/ResetPassword";
import Terms         from "../pages/Terms/Terms";
import Privacy       from "../pages/Privacy/Privacy";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn)
    return <Navigate to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`} replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/login"           element={<GuestRoute><Login /></GuestRoute>}   />
      <Route path="/signup"          element={<GuestRoute><Signup /></GuestRoute>}  />
      <Route path="/forgot-password" element={<ForgotPassword />}                  />
      <Route path="/reset-password"  element={<ResetPassword />}                   />
      <Route path="/terms"           element={<Terms />}                            />
      <Route path="/privacy"         element={<Privacy />}                          />

      <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>}  />
      <Route path="/practice"    element={<ProtectedRoute><Practice /></ProtectedRoute>}   />
      <Route path="/progress"    element={<ProtectedRoute><Progress /></ProtectedRoute>}   />
      <Route path="/settings"    element={<ProtectedRoute><Settings /></ProtectedRoute>}   />
      <Route path="/profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>}    />
      <Route path="/quiz/:topic" element={<ProtectedRoute><Quiz /></ProtectedRoute>}       />
    </Routes>
  );
};

export default AppRoutes;