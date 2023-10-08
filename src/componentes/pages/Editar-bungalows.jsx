import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';

import '../../styles/editar-bungalow.css'
import { Bungalow } from "./Bungalow";


export const EditarBungalows = () => {

  const [bungalow, setBungalow] = useState({});
  const [precios, setPrecios] = useState([]);
  const [descripcion, setDescripcion] = useState('')

  const { idBungalow } = useParams();
  const bungalowId = parseInt(idBungalow)

  const token = localStorage.getItem('accessToken');

  const [formulario, setFormulario] = useState({
    precio: [],
    descripcion: ''
  });



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

        const data = await response.json();

        if (Object.keys(bungalow).length < 1) {

          const preciosNumeros = data.bungalow[0].precio.map(item => item.costo);
          setBungalow(data.bungalow[0]);
          setPrecios(preciosNumeros)
          setDescripcion(bungalow.descripcion);
          setFormulario(prevState => ({
            ...prevState,
            precio: data.bungalow[0].precio,
            descripcion: bungalow.descripcion
          }));

        }

      } catch (error) {
        console.log(error);
      }

    };

    obtenerBungalow();

  }, [token, bungalow],);


  const handleSubmit = async (e) => {

    e.preventDefault();

    const preciosActualizados = precios.map((costo, index) => {

      return {
        ocupantes: formulario.precio[index].ocupantes,
        costo: parseInt(costo)
      }
      
  })
    
    console.log(preciosActualizados);

    try {
      const response = await fetch(`https://termas-server.vercel.app/api/bungalows/precio/${bungalowId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-token': token
        },
        body: JSON.stringify({
          precio: preciosActualizados,
          descripcion: descripcion
        })
      });

      if (response.status === 200) {

        console.log('todo ok');

        return navigate('/bungalows')

      } else {
        console.error('Error al modificar los datos:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }





  const handleDescripcionChange = (e) => {

    //toma como si fuera un objeto al input y mapea los atributos
    setDescripcion(e.target.value)

  }

  const handlePrecioChange = (e, index) => {

    if (e.target.value !== NaN) {

      const newPrecios = [...precios]; // Copia el array de precios
      newPrecios[index] = e.target.value; // Actualiza el precio en el índice correspondiente
      setPrecios(newPrecios); // Actualiza el estado precios con el nuevo array

    }
  }
  return (

    <main className="editar">
      <h1>{bungalow.nombre}</h1>
      <p>Completa el campo que desea modificar</p>
      <form onSubmit={handleSubmit}>
        {precios.map((costo, index) => (
          <label htmlFor={index} key={index} >Precio para {formulario.precio[index].ocupantes} ocupantes:
            <input
              type="number"
              value={costo}
              name={formulario.precio[index].ocupantes}
              id={index}
              onChange={(e) => handlePrecioChange(e, index)}
              placeholder={costo.costo}
            />
          </label>
        ))}
        <label htmlFor="descripcion">Descripción:
          <textarea type="text" value={descripcion} name="descripcion" onChange={handleDescripcionChange} id="descripcion" placeholder={bungalow.descripcion} />
        </label>
        <button type="submit">Modificar Datos</button>
      </form>
    </main>

  )
}
