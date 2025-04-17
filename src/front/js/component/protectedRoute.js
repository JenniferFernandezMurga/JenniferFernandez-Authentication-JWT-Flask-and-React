import React from "react";
import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../store/appContext";

// export const ProtectedRoute = ({ children }) => {
//   const { store } = useContext(Context);
//   const token = localStorage.getItem('token');

//   if (!token || !store.isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };
export const ProtectedRoute = ({ children }) => {
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
  
  return store.logged ? children : <Navigate to="/login" replace />;
};