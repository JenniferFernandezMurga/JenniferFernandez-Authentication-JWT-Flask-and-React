const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			user: null,
            token: null,
			logged:null,
			message: null,
			auth: false,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {

			// getUser: async () => {
            //     try {
            //         const token = sessionStorage.getItem("token");
            //         if (!token) throw new Error("No token found");

            //         const response = await fetch(`${process.env.BACKEND_URL}/api/user`, {
            //             headers: {
            //                 "Authorization": `Bearer ${token}`
            //             }
            //         });

            //         if (!response.ok) throw new Error("Error al obtener el usuario");

            //         const data = await response.json();
            //         setStore({ user: data });

            //         // Una vez que tenemos el usuario, obtenemos sus mascotas
            //         // getActions().getPets(data.id);

            //     } catch (error) {
            //         console.log("Error al obtener usuario", error);
            //     }
            // },
			getUser: async () => {
				const token = sessionStorage.getItem("token");
				if (!token) throw new Error("No token");
			  
				const response = await fetch("/api/user", {
				  headers: {
					"Authorization": `Bearer ${token}`
				  }
				});
			  
				if (!response.ok) {
				  // Si el token es inválido (401 Unauthorized)
				  if (response.status === 401) {
					sessionStorage.removeItem("token");
				  }
				  throw new Error("Error al cargar usuario");
				}
			  
				const data = await response.json();
				setStore({ user: data.user, logged: true });
			  }
			  ,
			// Use getActions to call a function within a fuction
			

			login: async (email, password) => {
				// Validación básica
				if (!email || !password) {
					console.error("Email y password son requeridos");
					return { success: false, message: "Email y password son requeridos" };
				}
			
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							// Añade esto si tienes problemas de CORS
							"Origin": window.location.origin
						},
						body: JSON.stringify({ email, password })
					});
			
					// Manejo de errores HTTP
					if (!response.ok) {
						const errorData = await response.json().catch(() => ({}));
						console.error("Error en login:", errorData.message || "Credenciales inválidas");
						return { 
							success: false, 
							message: errorData.message || "Error en la autenticación" 
						};
					}
			
					const data = await response.json();
					
					// Validación de la respuesta
					if (!data.token) {
						console.error("No se recibió token en la respuesta");
						return { success: false, message: "Error en la respuesta del servidor" };
					}
			
					// Almacenamiento seguro (usa solo localStorage O sessionStorage, no ambos)
					localStorage.setItem("token", data.token);
					if (data.user) {
						localStorage.setItem("user", JSON.stringify(data.user));
					}
			
					// Actualización del store (una sola llamada)
					setStore({ 
						logged: true,
						token: data.token,
						user: data.user || null,
						isAuthenticated: true
					});
			
					return { 
						success: true, 
						message: "Login exitoso",
						user: data.user 
					};
			
				} catch (error) {
					console.error("Error en login:", error);
					// Limpieza en caso de error
					localStorage.removeItem("token");
					localStorage.removeItem("user");
					setStore({ 
						logged: false,
						token: null,
						user: null,
						isAuthenticated: false
					});
					return { 
						success: false, 
						message: error.message || "Error en la conexión" 
					};
				}
			},
			// login: async (email, password) => {
			// 	if (!email || !password) {
			// 		console.error("Email y password son requeridos");
			// 		return { success: false, message: "Email y password son requeridos" };
			// 	}
			
			// 	try {
			// 		const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
			// 			method: "POST",
			// 			headers: {
			// 				"Content-Type": "application/json"
			// 			},
			// 			body: JSON.stringify({ email, password })
			// 		});
			
			// 		// Verifica si la respuesta no es exitosa
			// 		if (!response.ok) {
			// 			const errorData = await response.json();
			// 			console.error("Error en login:", errorData.message || "Credenciales inválidas");
			// 			return { 
			// 				success: false, 
			// 				message: errorData.message || "Credenciales inválidas" 
			// 			};
			// 		}
			
			// 		const data = await response.json();
			// 		console.log("Respuesta del login:", data);
			
			// 		// Verifica que la respuesta tenga la estructura esperada
			// 		if (!data.token) {
			// 			console.error("No se recibió token en la respuesta");
			// 			return { success: false, message: "Error en la respuesta del servidor" };
			// 		}
			
			// 		// Guarda el token y el usuario
			// 		localStorage.setItem("token", data.token);
					
			// 		// Asegúrate que data.user existe antes de guardarlo
			// 		if (data.user) {
			// 			localStorage.setItem("user", JSON.stringify(data.user));
			// 		} else {
			// 			console.warn("La respuesta no incluye datos de usuario");
			// 		}
			
			// 		// Actualiza el store de una sola vez
			// 		setStore({ 
			// 			logged: true,
			// 			token: data.token,
			// 			user: data.user || null,  // Asegura que user sea null si no viene en la respuesta
			// 			isAuthenticated: true
			// 		});
			
			// 		return { 
			// 			success: true, 
			// 			message: "Login exitoso",
			// 			user: data.user 
			// 		};
			
			// 	} catch (error) {
			// 		console.error("Error en login:", error);
			// 		// Limpieza en caso de error
			// 		localStorage.removeItem("token");
			// 		localStorage.removeItem("user");
			// 		setStore({ 
			// 			logged: false,
			// 			token: null,
			// 			user: null,
			// 			isAuthenticated: false
			// 		});
			// 		return { 
			// 			success: false, 
			// 			message: error.message || "Error en la conexión" 
			// 		};
			// 	}
			// },
			signup: async (email, password, navigate) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/signup`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email, password })
						// credentials: 'include'  // Necesario para CORS con credenciales
					});
			
					const data = await response.json();
					console.log("Respuesta del servidor:", response);
					console.log("Datos recibidos:", data);
			
					if (data.user_exists) {
						// Usuario existe -> redirigir a login con email
						navigate("/login");
						return { success: true, exists: true };
					}
			
					if (!response.ok) throw new Error(data.msg || "Error en registro");
			
					// Registro exitoso -> redirigir a login
					navigate("/login");
					return { success: true, exists: false };
			
				} catch (error) {
					console.error("Error en registro:", error);
					return { success: false, error: error.message };
				}
			}
			,

			getPrivate: async () => {
				let token = localStorage.getItem("token")
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/private`, {
						method: "GET",
						headers: {
							"Authorization": `Bearer ${token}`
						},
					});
					const result = await response.json();
					console.log(result)
				} catch (error) {
					console.error(error);
				};
			},
				

				verifyToken: async () => {
					const token = localStorage.getItem("token");
					
					if (!token) {
						setStore({ auth: false, logged: false, token: null });
						return false;
					}
				
					try {
						const response = await fetch(`${process.env.BACKEND_URL}/api/verify-token`, {
							method: "GET",
							headers: {
								"Authorization": `Bearer ${token}`
							}
						});
				
						if (!response.ok) {
							throw new Error("Token inválido");
						}
				
						const result = await response.json();
						setStore({ 
							auth: true,
							logged: true,
							token: token
						});
						return true;
				
					} catch (error) {
						console.error("Error verificando token:", error);
						localStorage.removeItem("token");
						setStore({ auth: false, logged: false, token: null });
						return false;
					}
				},


			logout: () => {
				localStorage.removeItem("token");
				setStore({ 
					token: null,
					user: null,
					auth: false,
					logged: false
				});
				// navigate("/")
			}
			,

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},

			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
			
		}
	
	};
}


export default getState;
