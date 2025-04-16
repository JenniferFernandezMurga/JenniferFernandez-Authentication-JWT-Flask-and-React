
import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";

export const Private = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();


  //  VOY POR AQUI, PENDIENTE BUSCAR LA FORMA DE QUE NADIE PUEDA ACCEDER A PIVATE DESDE URL Y QUE SI NO HAY TOKEN SALGA
  useEffect(() => {

    actions.getUser()
      .then(() => {
     
        if (actions.getPrivate) {
          return actions.getPrivate();
        }
      })
      .then(privateData => {
        if (privateData) {
          console.log("Private data received:", privateData);
        }
      })
      .catch(error => console.error("Error in operations:", error));
  }, [actions]); 
console.log(store.data);

// useEffect(() => {
//   // Verificación al cargar el componente
//   const token = localStorage.getItem("token"); // o sessionStorage
  
//   if (!token) {
//     navigate("/login"); // Redirige si no hay token
//     return;
//   }

//   // Verificación adicional con el backend
//   actions.validateToken(token)
//     .catch(() => {
//       localStorage.removeItem("token");
//       navigate("/login");
//     });
// }, [navigate, actions]);

// useEffect(() => {
//     const loadUserData = async () => {
//       try {
//         // 1. Verificar token primero
//         const token = sessionStorage.getItem("token");
//         if (!token) {
//           navigate("/login");
//           // alert("Sesión cancelada")
//           return;
//         }
  
//         // 2. Obtener usuario
//         await actions.getUser();
        
//         // 3. Verificar que el usuario se cargó
//         if (!store.user) {
//           throw new Error("No se pudo cargar la información del usuario");
//         }
  
//         // 4. Obtener datos privados si es necesario
//         if (actions.getPrivate) {
//           const privateData = await actions.getPrivate();
//           console.log("Datos privados:", privateData);
//         }
  
//       } catch (error) {
//         console.error("Error en Private:", error);
//         sessionStorage.removeItem("token");
//         navigate("/");
//       }
//     };
  
//     loadUserData();
//   }, [actions, navigate]);
// useEffect(() => {
//   const verifyAndLoad = async () => {
//     const token = sessionStorage.getItem("token");
    
//     // 1. Redirigir si no hay token
//     if (!token) {
//       navigate("/login");
//       alert("Sesión cancelada, vuelva a intentarlo")
//       return;
//     }

//     try {
//       // 2. Verificar token y cargar datos
//       await actions.getUser(); // Esta acción debería validar el token con el backend
      
//       // 3. Redirigir si el usuario no se cargó (token inválido)
//       if (!store.user) {
//         throw new Error("Token inválido o expirado");
//       }

//       // 4. Cargar datos adicionales (opcional)
//       await actions.getPrivate(); // Uso de ?. por si no existe

//     } catch (error) {
//       console.error("Error de autenticación:", error);
//       sessionStorage.removeItem("token");
//       navigate("/login");
//     }
//   };

//   verifyAndLoad();
// }, [actions, navigate, store.user]); // Dependencias clave
// console.log(store.user);

  return (
    <div className="container py-5">

     {/* Perfil usuario */}
     <div className="card p-4 mb-5" >
        <h2 className="text-dark mb-3">Hello, <span className="fw-bold">{store.result}</span> 👋</h2>
        <h4>Welcome to your private view.</h4>
      </div>
    </div>
  );
};