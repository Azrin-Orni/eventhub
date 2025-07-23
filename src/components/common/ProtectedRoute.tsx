import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ("attendee" | "organizer")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && !allowedRoles.includes(role)) {
    return <Navigate to="/events" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
