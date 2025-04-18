
import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";


export const Private = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

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

  return (
    <div className="container py-5">

     <div className="card p-4 mb-5" >
        <h2 className="text-dark mb-3">Hola, <span className="fw-bold">{store.result}</span> 👋</h2>
        <h4>Bienvenido a tu vista privada</h4>
  
        <div className="container py-5">
    <h2 className="text-center mb-5">📌 Mis Posts Favoritos</h2>
    
    <div className="row g-4">
    
        <div className="col-lg-4 col-md-6">
            <div className="card h-100 border-0 shadow-sm hover-effect">
                <div className="position-relative">
                    <img 
                        src="https://www.xtrafondos.com/wallpapers/montanas-en-el-bosque-sneffels-3900.jpg" 
                        className="card-img-top object-fit-cover" 
                        alt="Post 1" 
                        style={{height:"200px"}}
                    />
                    <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                        <i className="fas fa-heart"></i> 245
                    </span>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Aventura en las Montañas</h5>
                    <p className="card-text text-muted">Un viaje increíble por los Alpes suizos con vistas espectaculares.</p>
                </div>
                <div className="card-footer bg-transparent border-0 d-flex justify-content-between">
                    <button className="btn btn-sm btn-outline-primary">
                        <i className="fas fa-bookmark"></i> Guardar
                    </button>
                    <button className="btn btn-sm btn-outline-success">
                        <i className="fas fa-share-alt"></i> Compartir
                    </button>
                </div>
            </div>
        </div>

      
        <div className="col-lg-4 col-md-6">
            <div className="card h-100 border-0 shadow-sm hover-effect">
                <div className="position-relative">
                    <img 
                        src="https://tse3.mm.bing.net/th?id=OIP.FL6r-StiKPIoGxDaylYHMwHaEb&pid=Api&P=0&h=180" 
                        className="card-img-top object-fit-cover" 
                        alt="Post 2" 
                         style={{height:"200px"}}
                    />
                    <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                        <i className="fas fa-heart"></i> 189
                    </span>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Atardecer en la Playa</h5>
                    <p className="card-text text-muted">Relajante tarde en las playas de Bali, Indonesia.</p>
                </div>
                <div className="card-footer bg-transparent border-0 d-flex justify-content-between">
                    <button className="btn btn-sm btn-outline-primary">
                        <i className="fas fa-bookmark"></i> Guardar
                    </button>
                    <button className="btn btn-sm btn-outline-success">
                        <i className="fas fa-share-alt"></i> Compartir
                    </button>
                </div>
            </div>
        </div>

       
        <div className="col-lg-4 col-md-6">
            <div className="card h-100 border-0 shadow-sm hover-effect">
                <div className="position-relative">
                    <img 
                        src="https://s1.1zoom.me/b5050/538/Japan_Tokyo_Temples_Flowering_trees_Asakusa_Kannon_549958_3840x2400.jpg" 
                        className="card-img-top object-fit-cover" 
                        alt="Post 3" 
                         style={{height:"200px"}}
                    />
                    <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                        <i className="fas fa-heart"></i> 312
                    </span>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Vida Urbana en Tokio</h5>
                    <p className="card-text text-muted">Explorando la vibrante ciudad de Tokio de noche.</p>
                </div>
                <div className="card-footer bg-transparent border-0 d-flex justify-content-between">
                    <button className="btn btn-sm btn-outline-primary">
                        <i className="fas fa-bookmark"></i> Guardar
                    </button>
                    <button className="btn btn-sm btn-outline-success">
                        <i className="fas fa-share-alt"></i> Compartir
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
    </div>
  );
};