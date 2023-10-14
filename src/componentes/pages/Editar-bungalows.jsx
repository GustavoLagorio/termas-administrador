import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';

import '../../styles/editar-bungalow.css'

export const EditarBungalows = () => {

   

  //Declaramos los estados que van a controlar el bungalow, los precios y la descripcion
  const [bungalow, setBungalow] = useState({});
  const [precios, setPrecios] = useState([]);
  const [descripcion, setDescripcion] = useState('')

  //Tomamos por parametro de la URL el idBungalow para identificar el bungalow seleccionado
  //tambien parseamos el valor porque es un string
  const { idBungalow } = useParams();
  const bungalowId = parseInt(idBungalow)

  //Obtenemos el token revalidado
  const token = localStorage.getItem('accessToken');

  //Estructura del formulario
  const [formulario, setFormulario] = useState({
    precio: [],
    descripcion: ''
  });

  const navigate = useNavigate();

  useEffect(() => {

    //Obtenemos el bungalow
    const obtenerBungalow = async () => {

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/bungalows/${bungalowId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-token': token
          },

        })

        const data = await response.json();

        //Solo en el caso de que tenamos bungalow en la base de datos ejecuta este codigo
        //Mapeamos el array precio de la data que obtenemos de la BD y guardamos en preciosNumeros
        //este solo contiene los valores numericos de los precios no los ocupantes
        //Guardamos en el array precios preciosNumeros
        //Actualizamos el formulario con lo obtenido en la data
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

    //Ejecutamos la funcion para obtener el bungalow
    obtenerBungalow();

  }, [token, bungalow],); //Pasamoe como parametro token y bungalow para que la funcion se ejecute cuando estos cambian


  //Maneja el envio del formulario
  const handleSubmit = async (e) => {

    e.preventDefault();

    //Mapea preciosActualizados para guardar en cada parametro del los objetos que tiene dentro el array precio
    const preciosActualizados = precios.map((costo, index) => {

      return {

        ocupantes: formulario.precio[index].ocupantes,
        costo: parseInt(costo)

      }
    })

    //Enviamos la modificacion de los precios o de la descripcion en el body
    try {

      const response = await fetch(`${import.meta.env.VITE_API_URL}/bungalows/precio/${bungalowId}`, {
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
        
        //Si la respuesta es 200 navega al menu Bungalows
        return navigate('/bungalows')

      } else {

        console.error('Error al modificar los datos:', response.statusText);

      }
    } catch (error) {

      console.error('Error en la solicitud:', error);

    }
  }

  //Maneja los cambios en el input de descripcion
  const handleDescripcionChange = (e) => {

    //Toma como si fuera un objeto al input y mapea los atributos
    setDescripcion(e.target.value)

  }

  //Maneja los cambios en el input precio
  const handlePrecioChange = (e, index) => {
    
    //Impide que se ejecute los cambios si el input esta vacio para que no de error por consola
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
        {/*Mapea precios para generar de forma dinamica el formulario tambien pasa como parametro el evento e index
        a la funcion handlePrecioChange para determinar que precio se desea modificar*/}
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
