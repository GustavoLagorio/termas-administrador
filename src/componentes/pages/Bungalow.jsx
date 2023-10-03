import { useParams, useNavigate } from "react-router-dom";
import Calendario from '../common/Calendario'
import React, { useState, useEffect } from 'react';
import ReservasPorBungalow from '../common/ReservasPorBungalow';

import '../../styles/bungalow.css'


export const Bungalow = () => {

  const { idBungalow } = useParams();

  const bungalowId = parseInt(idBungalow);

  const token = localStorage.getItem('accessToken');

  const [bungalow, setBungalow] = useState({});

  const navigate = useNavigate();

  useEffect(() => {

    const obtenerBungalow = async () => {

      try {
        const response = await fetch(`https://termas-server.vercel.app/api/bungalows/${bungalowId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-token': token
          },
        })

        if (response.status === 200) {

          const data = await response.json();

          setBungalow(data.bungalow[0]);
          console.log(data.bungalow[0]);
          console.log(bungalow.nombre);
          console.log(bungalow.idBungalow);


        } else {
          console.error('Error al obtener los bungalows:', response.statusText);
        }
      } catch (error) {
        console.log(error);
      }

    };

    obtenerBungalow();

  }, [token],);

  const [formulario, setFormulario] = useState({
    bungalow: bungalowId,
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    documento: ''
  });

  const { nombre, apellido, telefono, email, documento, startDate, endDate } = formulario;

  const [fechas, setFechas] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });



  useEffect(() => {
    // Actualiza el formulario cuando las fechas del calendario cambian<
    setFormulario({
      ...formulario,
      startDate: fechas.startDate,
      endDate: fechas.endDate,
    });
  }, [fechas]);

  const handleInputChange = (e) => {
    // Actualiza el estado del formulario cuando los campos de entrada cambian
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleReservaSubmit = async (e) => {

    e.preventDefault();

    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch('https://termas-server.vercel.app/api/events/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-token': token
        },
        body: JSON.stringify(formulario)
      })

      if (response.status === 200) {

        return navigate("/bungalows");

      } else {

        console.error('Inicio de sesión fallido');
        return navigate("/");

      }

    } catch (error) {

      console.error('Error al enviar los datos:', error);

    }
  };

  const handleFechasSeleccionadas = (startDate, endDate) => {
    //Esta funcion se pasa como parametro al componente Calendario para
    //tomar las fechas seleccionadas
    setFechas({ startDate, endDate });
    setFormulario({
      ...formulario,
      startDate,
      endDate,
    });
  };
  return (
    <main className="bungalow">
      <h1>{bungalow.nombre}</h1>
      <div className="reservar">
        <h2>Realiza una nueva reserva</h2>
        <form onSubmit={handleReservaSubmit}>
          <Calendario onFechasSeleccionadas={handleFechasSeleccionadas} />
          <input type="text" required={true} className="campo" name="nombre" value={nombre} onChange={handleInputChange} placeholder="Nombre" />
          <input type="text" required={true} className="campo" name="apellido" value={apellido} onChange={handleInputChange} placeholder="Apellido" />
          <input type="phone" required={true} className="campo" name="telefono" value={telefono} onChange={handleInputChange} placeholder="Teléfono" />
          <input type="email" required={true} className="campo" name="email" value={email} onChange={handleInputChange} placeholder="Email" />
          <input type="number" required={true} className="campo" name="documento" value={documento} onChange={handleInputChange} placeholder="Documento" />
          <button type="submit" className="btn">Reservar</button>
        </form>
      </div>
      <div className="buscar">
        <h2>Lista de reservas</h2>
        <ReservasPorBungalow bungalowId={bungalow.idBungalow || ''} />
      </div>
    </main>
  )
}
