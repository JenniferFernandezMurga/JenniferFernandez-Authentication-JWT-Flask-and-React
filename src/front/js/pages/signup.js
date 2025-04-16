import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { SignupForm } from "../component/signupForm";

export const Signup = () => {
    const { store, actions } = useContext(Context);


    // useEffect(()=>{
     
    // },[])

    return (
        <div className="text-center mt-5">
            <h1>Signup</h1>
            <SignupForm/>
        </div>
    );
};
