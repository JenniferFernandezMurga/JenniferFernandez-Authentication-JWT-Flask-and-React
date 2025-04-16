import React, {useState, useContext} from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const LoginForm = () => {
    const {store,actions} = useContext(Context)
    let navigate = useNavigate();
    // const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    async function handleSubmit(e) {
        e.preventDefault()
       let logged =  actions.login(email,password);
       console.log(logged);
      
       if (logged) {
            navigate("/private")
            
       }
    }
        
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     setError("");
    
    //     try {
    //       const response = await actions.login(email, password);
          
    //       if (response && response.token) {
    //         // 1. Almacenar el token
    //         localStorage.setItem("token", response.token);
            
    //         // 2. Redirigir a la vista Private
    //         navigate("/private");
    //       } else {
    //         setError("Credenciales incorrectas o error en el servidor");
    //       }
    //     } catch (err) {
    //       setError(err.message || "Error al iniciar sesión");
    //       console.error("Login error:", err);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };
    

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