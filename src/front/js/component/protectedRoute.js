import React from "react";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const ProtectedRoute = ({ children }) => {
  const { store } = useContext(Context);
  const token = localStorage.getItem('token');

  if (!token || !store.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};