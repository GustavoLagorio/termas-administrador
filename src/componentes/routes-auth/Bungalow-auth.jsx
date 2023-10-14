import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Bungalow } from "../pages/Bungalow";
import { getEnvironments } from '../../helpers/getEnvironments';

//Este componente es un estadio intermedio entre la vista anterior y la vista Bungalow
//el objetivo es validar el JWT guadado en el localStorage antes de renderizar Bungalow

export const BungalowAuth = () => {

  const { VITE_API_URL } = getEnvironments();

  //Se declaran estados de 'cargando' y 'esta logueado'
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {

    const validarRuta = async () => {

      //Envia en el header el token del local para validarlo y renovarlo
      try {

        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${VITE_API_URL}/auth/renew`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-token': token

          }
        });

        if (response.status === 200) {

          //Si la respuesta es 200 se cambia a true el estado 'esta logueado'
          const { token } = await response.json();
          localStorage.setItem('accessToken', token);
          setIsLoggedIn(true);

        } else {

          setIsLoggedIn(false);

        }
      } catch (error) {

        console.error('No tienes permiso de navegación');

      } finally {

        setIsLoading(false);

      }
    };

    validarRuta();
  }, []); // Un array vacio indica que se renderiza cuando se inicializa

  if (isLoading) {

    return <div>Loading...</div>;
    
  }

  if (isLoggedIn) {
    
    //Retorna el componente Bungalow si es true
    return <Bungalow />;

  } else {
    
    //Devuelve al login si es false
    return <Navigate to="/" />

  }
};
