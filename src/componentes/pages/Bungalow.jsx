import { useParams, useNavigate } from "react-router-dom";
import Calendario from '../common/Calendario'
import React, { useState, useEffect } from 'react';
import ReservasPorBungalow from '../common/ReservasPorBungalow';

import '../../styles/bungalow.css'


export const Bungalow = () => {

  const [bungalow, setBungalow] = useState({});

  const [isLoading, setIsLoading] = useState(true);

  const { idBungalow } = useParams();

  const bungalowId = parseInt(idBungalow);

  const token = localStorage.getItem('accessToken');

  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    idBungalow: '',
    bungalow: '',
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    documento: '',
    startDate: new Date(),
    endDate: new Date(),
    auto: '',
    patente: '',
    pago: '',
    notas: ''    
  });

  const { nombre, apellido, telefono, email, documento, startDate, endDate, auto, patente, pago, notas } = formulario;

  const [fechas, setFechas] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

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
          console.log(bungalow);
          const { nombre } = data.bungalow[0]
          console.log(nombre);
          setFormulario(prevState => ({
            ...prevState,
            idBungalow: bungalowId,
            bungalow: nombre
          }));          
          console.log(formulario);
          setIsLoading(false);

        } else {
          console.error('Error al obtener los bungalows:', response.statusText);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }

    };

    obtenerBungalow();  

  }, [token, bungalowId]);

  const handleInputChange = (e) => {
    // Actualiza el estado del formulario cuando los campos de entrada cambian
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleFechasSeleccionadas = (startDate, endDate) => {
    //Esta funcion se pasa como parametro al componente Calendario para
    //tomar las fechas seleccionadas
    //Guardamos las fechas del rango
    /*for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
      rangeDates.push(new Date(currentDate));
    }*/
    setFechas({ startDate, endDate });
    setFormulario({
      ...formulario,
      startDate,
      endDate,
      //rangeDates
    });
  };

  const handleReservaSubmit = async (e) => {

    e.preventDefault();
    console.log(formulario);

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
          <input type="text" className="campo" name="auto" value={auto} onChange={handleInputChange} placeholder="Marca de auto" />
          <input type="text" className="campo" name="patente" value={patente} onChange={handleInputChange} placeholder="Patente" />
          <input type="number" required={true} className="campo" name="pago" value={pago} onChange={handleInputChange} placeholder="Pago realizado" />
          <textarea type="text" className="campo" name="notas" value={notas} onChange={handleInputChange} id="notas" placeholder='Agregar información' />
          <button type="submit" className="btn">Reservar</button>
        </form>
      </div>
      <div className="buscar">
        <h2>Lista de reservas</h2>
        <ReservasPorBungalow bungalowId={bungalowId} />
      </div>
    </main>
  )
}
