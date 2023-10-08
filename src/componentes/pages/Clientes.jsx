import { useEffect, useState } from "react";

import '../../styles/clientes.css'

export const Clientes = () => {

    const token = localStorage.getItem('accessToken');

    const [clientes, setClientes] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {

        const obtenerClientes = async () => {

            try {
                const response = await fetch('https://termas-server.vercel.app/api/events/clientes', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-token': token
                    },
                })

                if (response.status === 200) {

                    const data = await response.json();
                    setClientes(data.clientes)
                    console.log(data);

                    setCargando(false);


                } else {
                    console.error('Error al obtener las reservas:', response.statusText);
                }
            } catch (error) {
                setError(error);
                console.log(error);
            }

        };

        obtenerClientes();
        console.log(clientes);

    }, [token]);

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
