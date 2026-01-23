import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Check if user exists in localStorage
  const user = localStorage.getItem("user");
  
  if (!user) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" />;
  }
  
  console.log("User found, rendering children");
  return children;
}