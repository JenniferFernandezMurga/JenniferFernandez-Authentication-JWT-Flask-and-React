import React, {useActionState, useContext} from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Navbar = () => {
	const {actions , store} = useContext(Context)

	const handleLogout = () => {
		actions.logout();
	  };

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					{/* {store.auth ? <Link to="/">
						<button className="btn btn-primary">Logout</button>
					</Link>:null} */}
					<Link to="/">
					<button className="btn btn-primary" onClick={handleLogout}>Logout</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};
