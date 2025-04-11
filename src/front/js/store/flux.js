const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			user: null,
            token: null,
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
			// Use getActions to call a function within a fuction
			login: async (email, password) => {


				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");

				const raw = JSON.stringify({
					"email": email,
					"password": password
				});

				const requestOptions = {
					method: "POST",
					headers: myHeaders,
					body: raw,
					redirect: "follow"
				};

				try {
					const response = await fetch("https://vigilant-train-5g4w54rg95j5cvwxp-3001.app.github.dev/api/login", requestOptions);
					const result = await response.json();

					if (response.status === 200) {
						localStorage.setItem("token", result.access_token)
						return true
					}
				} catch (error) {
					console.error(error);
					return false;
				};
			},
			getProfile: async () => {
				let token = localStorage.getItem("token")
				try {
					const response = await fetch("https://vigilant-train-5g4w54rg95j5cvwxp-3001.app.github.dev/api/profile", {
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

			// login: async (email, password, navigate) => {
            //     try {
            //         const resp = await fetch(`${process.env.BACKEND_URL}/api/login`, {
            //             method: "POST",
            //             headers: { "Content-Type": "application/json" },
            //             body: JSON.stringify({ email, password })
            //         });
            
            //         if (!resp.ok) throw new Error("Error al iniciar sesión");
            
            //         const data = await resp.json();
            //         const token = data.token;
            //         if (!token) throw new Error("No se recibió el token");
            
            //         sessionStorage.setItem("token", token); // 🔹 Guardar en sessionStorage
            //         sessionStorage.setItem("user", JSON.stringify(data.user));
            
            //         setStore({ token:data.token, user: data.user });
            //         navigate("/");
            //     } catch (error) {
            //         console.error("Error al iniciar sesión", error);
            //         alert("Error al iniciar sesión");
            //     }
            // },
            


            signup: async (dataUser, navigate) => {
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/signup`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(dataUser)
                    });

                    if (!resp.ok) {
                        throw new Error("Error en el registro");
                    }

                    const data = await resp.json();
                    console.log("Usuario registrado exitosamente", data);

                    const token = data.token;
                    if (!token) {
                        throw new Error("No se recibió el token");
                    }

                    sessionStorage.setItem("token", token);
                    setStore({ token });

                    const actions = getActions();
                    actions.getUser();
                    navigate("/");
                } catch (error) {
                }
            },
            getUser: async () => {
                try {
                    const token = sessionStorage.getItem("token");
                    if (!token) throw new Error("No token found");

                    const resp = await fetch(`${process.env.BACKEND_URL}/api/user`, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if (!resp.ok) {
                        throw new Error("Error al obtener el usuario");
                    }

                    const data = await resp.json();
                    setStore({ user: data });

                    // Obtener las mascotas del usuario
                    getActions().getPets(data.id);

                } catch (error) {
                    console.error("Error al obtener usuario:", error);
                    getActions().logout(); // 🔹 Si hay un error, cerrar sesión automáticamente
                }
            },

            // Cerrar sesión si el usuario está inactivo
          
			
			// tokenVerify:()=>{
				//crear un nuevo endpoint que se llame verificacion de token
				//la peticion en la funcion tokenVerify del front deberia actualizar un estado auth:

				verifyToken: async () => {
					let token = localStorage.getItem("token")
					try {
						const response = await fetch("https://urban-spork-4vw9jq7pxwh7vgx-3001.app.github.dev/api/favorites", {
							
							method: "GET",
							headers: {
								"Authorization": `Bearer ${token}`
							},
						});
						const result = await response.json();
	
						if (response.status !== 200) {
							setStore({auth:result.valid})
						}
						setStore({auth:result.valid})
					} catch (error) {
						console.error(error);
					};
				},





			

			logout:()=>{
			
					console.log("Cerrando sesión por inactividad o token expirado...");
					sessionStorage.removeItem("token");
					sessionStorage.removeItem("user");
					clearTimeout(getStore().refreshTimer);
					setStore({ token: null, user: null});
					window.location.href = "/";
		
			},

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
};

export default getState;
