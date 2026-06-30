import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Decode the token and check expiration
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const isExpired = payload.exp * 1000 < Date.now()
    if (isExpired) {
      localStorage.removeItem("token")
      return <Navigate to="/login" />
    }
  } catch (e) {
    localStorage.removeItem("token")
    return <Navigate to="/login" />
  }

  return children;
}

export default ProtectedRoute;
