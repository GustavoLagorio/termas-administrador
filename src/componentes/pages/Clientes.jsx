import { useEffect, useState } from "react";

import '../../styles/clientes.css'

export const Clientes = () => {
    
    //Obtenemos el token revalidado
    const token = localStorage.getItem('accessToken');

    //Declaramos estados para cargar datos del cliente y de carga
    const [clientes, setClientes] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        
        //Obtenemos la lista de clientes
        const obtenerClientes = async () => {

            try {

                const response = await fetch(`${import.meta.env.VITE_API_URL}/events/clientes`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-token': token
                    },

                })

                if (response.status === 200) {

                    //Si la respuesta es 200 guardamos la informacion en clientes
                    const data = await response.json();
                    setClientes(data.clientes);
                    setCargando(false);

                } else {

                    console.error('Error al obtener las reservas:', response.statusText);

                }
            } catch (error) {

                setError(error);
                console.log(error);

            }
        };

        //Llamamos a la funcion para obtener los clientes
        obtenerClientes();

    }, [token]); //Pasamos como parametro el token para que se ejecute la funcion cuando este cambia

    if (cargando) {

        return <div>Cargando Reservas...</div>

    } else {

        return <main className="clientes">
            <h1>Lista de Clientes</h1>
            <ul className="columns">
                <li>Nombre</li>
                <li>Apellido</li>
                <li>Teléfono</li>
            </ul>
            <ul>
                {/*Mapaeamos clientes para obtener cliente por cliente de forma dinamica*/}
                {clientes.map((cliente, index) => (
                    <li key={index} className="cliente">
                        <span className="nombre">
                            {cliente.nombre}
                        </span>
                        <span className="apellido">
                            {cliente.apellido}
                        </span>
                        <span>
                            {cliente.telefono}
                        </span>
                    </li>
                )
                )}
            </ul>
        </main>
    }
}
