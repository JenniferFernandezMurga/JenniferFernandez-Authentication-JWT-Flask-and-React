import React, { useContext } from "react";
import {Link} from "react-router-dom";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";

import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="padre">
		<div className="alert alert-success text-center m-4" role="alert">
			<h4 className="alert-heading">Bienvenido</h4>
			<p className="mb-0">Para acceder al contenido necesitas estar registrado.</p>
			<p> ¿Ya estás registrado?.</p>
			<hr/>
			
			<Link to="/signup"><button type="button" className="btn btn-primary m-2">No. Registrarse</button></Link>
			<Link to="/login"><button type="button" className="btn btn-secondary  m-2">Sí. Iniciar sesión.</button></Link>
		</div>
		</div>
	);
};
