import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReservasBungalows from '../common/ReservasBungalows';


import '../../styles/bungalows.css'

export const Bungalows = () => {

    //Obtiene el token revalidado
    const token = localStorage.getItem('accessToken');

    //Carga informacion del los bungalows
    const [bungalows, setBungalows] = useState([]);

    useEffect(() => {
        
        //Obtenemos los bungalows enviando el token en el header
        const obtenerBungalows = async () => {

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/bungalows`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-token': token
                    },
                })

                if (response.status === 200) {

                    //Guardamos la informacion obtenida en bungalows
                    const data = await response.json();
                    setBungalows(data.bungalows);


                } else {

                    console.error('Error al obtener los bungalows:', response.statusText);

                }
            } catch (error) {

                console.log(error);

            }

        };

        //Llamamos a la ejecucion para obtener los bungalows
        obtenerBungalows();

    }, [token]); //Le damos como parametro el token asi en cada cambio del token se ejecuta esta funcion

    
    //Guardamos los bungalows en una lista
    const listaBungalows = bungalows

    return (
        <main className='bungalows'>
            <div className="bungalows-list">
                <h1>Bienvenido</h1>
                <p>Seleccione una opción para el Bungalow</p>
                <ul>
                    {/*Mapeamos la lista de bungalows para crear la lista de forma dinamica*/}
                    {listaBungalows.map((bungalow) => (
                        <li key={bungalow.idBungalow}>
                            <h2>{bungalow.nombre}</h2>
                            <span>
                                <Link to={`/bungalows/${bungalow.idBungalow}`} >Reservas</Link>
                            </span>
                            <span>
                                <Link to={`/bungalows/${bungalow.idBungalow}/editar-bungalow`} >Editar</Link>
                            </span>
                        </li>
                    )
                    )}
                </ul>
            </div>
            <div className="clientes">
                <h2>Base de datos de Clientes</h2>
                <Link to='/clientes'>Clientes</Link>
            </div>
            <div className="buscar">
                <h2>Listado de Reservas</h2>
                <p>Esta lista muestra todas las reservas con fecha de salida mayor al dia actual</p>
                {/*Llamamos al componente que muesta las reservas de todos los bungalows juntos*/}
                <ReservasBungalows />
            </div>

        </main>
    )
}