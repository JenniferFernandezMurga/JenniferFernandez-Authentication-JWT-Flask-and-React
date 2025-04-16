import React, {useState, useContext} from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const SignupForm = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const {store,actions} = useContext(Context)
    let navigate = useNavigate();

    // async function handleSubmit(e) {
    //     e.preventDefault()
    //    let signup =  actions.signup(email,password);
       
    //    if (signup) {
        
    //         navigate("/login")
    //    }
        
    // }

    async function handleSubmit(e) {
        e.preventDefault();
        const { success, exists, error } = await actions.signup(email, password, navigate);
        
        if (!success) {
            alert(exists ? "Usuario existente - Redirigiendo a login" : `Error: ${error}`);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mx-auto w-50">
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e)=>setEmail(e.target.value)} value={email} />
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" onChange={(e)=>setPassword(e.target.value)} value={password} />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
};