import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import { LoginForm } from "../component/loginForm";
import "../../styles/home.css";

export const Login = () => {
    const { store, actions } = useContext(Context);


    return (
        <div className="text-center mt-5">
            <h1>Inicio de sesión</h1>
            <LoginForm/>
        </div>
    );
};
