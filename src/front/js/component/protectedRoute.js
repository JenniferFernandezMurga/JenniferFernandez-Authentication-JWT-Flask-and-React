import React from "react";
import { useContext, useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Context } from "../store/appContext";

export const ProtectedRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { store, actions } = useContext(Context);

  useEffect(() => {
    const verifyAuth = async () => {
      await actions.verifyToken();
      setIsLoading(false);
    };

    verifyAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return store.logged ? <Outlet/> : <Navigate to="/login" replace />;
};