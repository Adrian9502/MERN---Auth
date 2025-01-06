import FloatingShape from "./components/FloatingShape";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import VerifyEmail from "./pages/VerifyEmail";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import ForgotPassword from "./pages/ForgotPassword";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import ResetPassword from "./pages/ResetPassword";
// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace></Navigate>;
  }
  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace></Navigate>;
  }
  return children;
};

// redirect authenticated user to home page
const RedirectAuthenticateduser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }
  return children;
};
function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-green-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-green-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticateduser>
              <Signup />
            </RedirectAuthenticateduser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticateduser>
              <Login />
            </RedirectAuthenticateduser>
          }
        />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticateduser>
              <ForgotPassword />
            </RedirectAuthenticateduser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticateduser>
              <ResetPassword />
            </RedirectAuthenticateduser>
          }
        />
      </Routes>
      <Toaster />
    </main>
  );
}

export default App;
