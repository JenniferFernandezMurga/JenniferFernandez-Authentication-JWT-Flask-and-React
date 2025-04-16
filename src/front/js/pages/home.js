import React, { useContext } from "react";
import {Link} from "react-router-dom";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";

import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="alert alert-success text-center m-4" role="alert">
			<h4 className="alert-heading">Welcome!</h4>
			<p className="mb-0">To access, you must be registered</p>
			<p> Are you registered?.</p>
			<hr/>
			
			<Link to="/signup"><button type="button" className="btn btn-primary m-2">No. Go to Signup!</button></Link>
			<Link to="/login"><button type="button" className="btn btn-secondary  m-2">Yes. Go to Login!</button></Link>
	
		</div>
	);
};
