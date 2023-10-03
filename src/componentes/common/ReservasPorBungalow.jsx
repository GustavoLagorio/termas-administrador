import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import '../../styles/bungalow.css'


const BusquedaBungalow = ({bungalowId}) => {
    
   const idBungalow = parseInt(bungalowId)

    const token = localStorage.getItem('accessToken');

    const navigate = useNavigate();

    const [reservas, setReservas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const eliminarReserva = async (idReserva) => {
        try {
            const response = await fetch(
                `https://termas-server.vercel.app/api/events/${idReserva}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "x-token": token,
                    },
                }
            );

            if (response.status === 200) {

                // Actualizar la lista de reservas después de la eliminación
                const nuevasReservas = reservas.filter(

                    (reserva) => reserva.id !== idReserva

                );

                setReservas(nuevasReservas);
                return navigate("/bungalows");

            } else {
                console.error("Error al eliminar la reserva:", response.statusText);
            }
        } catch (error) {
            console.error("Error al eliminar la reserva:", error);
        }
    };

    useEffect(() => {

        const obtenerReservas = async (numero) => {

            try {
                const response = await fetch(`https://termas-server.vercel.app/api/events/filtrar?bungalow=${idBungalow}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-token': token
                    },
                })

                if (response.status === 200) {

                    const data = await response.json();

                    setReservas(data.eventos);
                    setCargando(false);

                    //En este lugar se va a agregar una actualizacion que muestre solo las reservas con fechas de finalizacion
                    //mayores a la fecha actual


                } else {
                    console.error('Error al obtener las reservas:', response.statusText);
                }
            } catch (error) {
                setError(error);
                console.log(error);
            }

        };

        obtenerReservas(bungalowId);

    }, [token]);

    if (cargando) {
        return <div>Cargando Reservas...</div>
    }
    if (error) {
        return <div>Error al cargar Reservas</div>

    } else {

        return <div className="reservas">
            <ul>

                {reservas.map((reserva) => (
                    <li key={reserva.id} className="reserva">
                        <ul>
                            <li>
                                <span>Nombre:</span>
                                <span>{reserva.nombre}</span></li>
                            <li>
                                <span>Apellido:</span>
                                <span>{reserva.apellido}</span></li>
                            <li>
                                <span>Teléfono:</span>
                                <span>{reserva.telefono}</span></li>
                            <li>
                                <span>Email:</span>
                                <span>{reserva.email}</span></li>
                            <li>
                                <span>Documento:</span>
                                <span>{reserva.documento}</span></li>
                            <li>
                                <span>Check-in:</span>
                                <span>{new Date(reserva.startDate).toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span></li>
                            <li>
                                <span>Check-out:</span>
                                <span>{new Date(reserva.endDate).toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span></li>
                        </ul>
                        <span>
                            <button className="btn" onClick={() => eliminarReserva(reserva.id)}>
                                Eliminar
                            </button>
                        </span>
                    </li>
                )
                )}
            </ul>
        </div>

    }
}

export default BusquedaBungalow;