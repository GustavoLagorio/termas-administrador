import { useParams, useNavigate } from "react-router-dom";
import Calendario from '../common/Calendario'
import React, { useState, useEffect } from 'react';
import ReservasPorBungalow from '../common/ReservasPorBungalow';
import { getEnvironments } from '../../helpers/getEnvironments';

import '../../styles/bungalow.css'


export const Bungalow = () => {

  //Carga informacion del bungalow y estados de carga
  const [bungalow, setBungalow] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  //Leemos el parametro id en la url para determinar el numero de bungalow seleccionado
  //ese valor se parsea porque es string
  const { idBungalow } = useParams();
  const bungalowId = parseInt(idBungalow);


  //Obtenemos el token revalidado
  const token = localStorage.getItem('accessToken');

  const navigate = useNavigate();

  //Estructura de la informacion del formulario y la BD
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

  //Evita que el calendario deje de renderizarse al hacerle click en una fecha
  const [fechas, setFechas] = useState({

    startDate: new Date(),
    endDate: new Date(),

  });

  useEffect(() => {

    //Obtenemos el bungalow segun el id del params
    const obtenerBungalow = async () => {

      try {

        const response = await fetch(`${import.meta.env.VITE_API_URL}/bungalows/${bungalowId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-token': token

          },
        })

        if (response.status === 200) {
          
          //Se guarda la informacion en bungalow, se desestructura el nombre y se
          //guarda la informacion del nombre y el id en el formulario
          const data = await response.json();
          setBungalow(data.bungalow[0]);
          const { nombre } = data.bungalow[0]
          //Toma el estado previo y lo sobreescribe solo en los parametros dados
          setFormulario(prevState => ({

            ...prevState,
            idBungalow: bungalowId,
            bungalow: nombre

          }));          
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

    //LLamamos al al funcion para obtener el bungalow
    obtenerBungalow();  

  }, [token, bungalowId]); //Se le da como parametros el token y el bungalowId para que se ejecute cuando estos cambian

  const handleInputChange = (e) => {

    // Actualiza el estado del formulario cuando los campos de entrada cambian
    setFormulario({ ...formulario, [e.target.name]: e.target.value });

  };

  //Guarda las fechas seleccionadas del componente Calendario
  const handleFechasSeleccionadas = (startDate, endDate) => {    

    setFechas({ startDate, endDate });
    setFormulario({
      ...formulario,
      startDate,
      endDate,
    });
  };

  //Ejecuta el envio del formulario al servidor
  const handleReservaSubmit = async (e) => {

    e.preventDefault();

    const token = localStorage.getItem('accessToken');

    try {

      const response = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
        
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-token': token
        },
        body: JSON.stringify(formulario)

      })

      if (response.status === 200) {

        //Si la respuesta es 200 navega hasta el menu de Bungalows para seguir trabajando
        return navigate("/bungalows");

      } else {

        //Si falla por algun motivo navega al login para reloguear
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
          {/*Pasamos como parametro la funcion que maneja las fechas seleccionadas*/}
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
        {/*Llamamos al componente ReservasPorBungalow que muestra las reservas del
        bungalow seleccionado*/}
        <ReservasPorBungalow bungalowId={bungalowId} />
      </div>
    </main>
  )
}