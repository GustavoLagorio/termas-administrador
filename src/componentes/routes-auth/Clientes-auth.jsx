import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Clientes } from "../pages/Clientes";

export const ClientesAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const validarRuta = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('https://termas-server.vercel.app/api/auth/renew', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-token': token
          }
        });

        if (response.status === 200) {
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
  }, []); // Empty dependency array means this effect will run once after initial render

  // Render loading spinner or component based on isLoading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isLoggedIn) {

    return <Clientes />;

  } else {

    return <Navigate to="/" />
    
  }
};
