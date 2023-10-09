import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import '../../styles/bungalow.css';
import 'sweetalert2/dist/sweetalert2.min.css';

const BusquedaBungalow = ({ bungalowId }) => {

    //Obtenemos el idBungalow del parametro de la URL para determinar el bungalow seleccionado
    const idBungalow = parseInt(bungalowId)

    //Obtenemos el token revalidado
    const token = localStorage.getItem('accessToken');

    const navigate = useNavigate();

    //Declaramos los estados que manejan las reservas, el estado de carga y el error
    const [reservas, setReservas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    //Funcion para eliminar la reserva que recibe como parametro el id de reserva
    const eliminarReserva = async (idReserva) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/events/${idReserva}`,
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

                //Se guarda la lista de reservas actualizada y se navega al menu de bungalows
                setReservas(nuevasReservas);
                return navigate("/bungalows");

            } else {

                console.error("Error al eliminar la reserva:", response.statusText);

            }
        } catch (error) {

            console.error("Error al eliminar la reserva:", error);

        }
    };

    //Esta funcion se ejecuta al darle click al boton eliminar y da una alerta de confirmacion
    const mostrarAlerta = (idReserva) => {

        Swal.fire({
            title: 'Requiere Confirmación',
            text: "¿Desea eliminar la reserva?",
            icon: 'warning',
            iconColor: '#f8333c',
            showCancelButton: true,
            confirmButtonColor: '#44af69',
            cancelButtonColor: '#254b5e',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            background: '#f1e6d2'
        }).then((result) => {
            //Si se confirma la accion se llama a eliminarReserva
            if (result.isConfirmed) {
                Swal.fire(
                    'Eliminado',
                    'La reserva fue eliminada',
                    'success'
                )
                eliminarReserva(idReserva)

            }
        })
    }

    useEffect(() => {

        //Obtenemos todas las reservas de la base de datos
        const obtenerReservas = async (numero) => {

            try {

                const response = await fetch(`${import.meta.env.VITE_API_URL}/events/filtrar?idBungalow=${idBungalow}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-token': token
                    },
                })

                if (response.status === 200) {

                    //Si la respuesta es 200 se guardan los eventos en reservas y se pone la carga en false
                    const data = await response.json();
                    setReservas(data.eventos);
                    setCargando(false);

                } else {

                    console.error('Error al obtener las reservas:', response.statusText);

                }
            } catch (error) {

                setError(error);
                console.log(error);

            }
        };

        //Llamamos a la funcion para obtener las reservas
        obtenerReservas(bungalowId);

    }, [token]);//Pasamos como parametro el token para que cuando este cambie la funcion se ejecute

    if (cargando) {

        return <div>Cargando Reservas...</div>

    }
    if (error) {

        return <div>Error al cargar Reservas</div>

    } else {

        //Invertimos el array de reservas para mostrar de la mas reciente a la mas antigua
        const reservasInvertidas = [...reservas].reverse();

        //Determinamos la fecha actual para filtar reservas
        const fechaActual = new Date();

        return <div className="reservas">
            <ul>

                {reservasInvertidas
                    //Filtramos y mapeamos las reservas. Se muestras todas las reservas que estan
                    //vigentes al dia de la fecha
                    .filter((reserva) => new Date(reserva.endDate) >= fechaActual)
                    .map((reserva) => (
                        <li key={reserva.id} className="reserva">
                            <ul>
                                <li>
                                    <span>Nombre:</span>
                                    <span>{reserva.nombre}</span>
                                </li>
                                <li>
                                    <span>Apellido:</span>
                                    <span>{reserva.apellido}</span>
                                </li>
                                <li>
                                    <span>Teléfono:</span>
                                    <span>{reserva.telefono}</span>
                                </li>
                                <li>
                                    <span>Email:</span>
                                    <span>{reserva.email}</span>
                                </li>
                                <li>
                                    <span>Documento:</span>
                                    <span>{reserva.documento}</span>
                                </li>
                                <li>
                                    <span>Check-in:</span>
                                    <span>{new Date(reserva.startDate).toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
                                </li>
                                <li>
                                    <span>Check-out:</span>
                                    <span>{new Date(reserva.endDate).toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
                                </li>
                                <li>
                                    <span>Auto:</span>
                                    <span>{reserva.auto}</span>
                                </li>
                                <li>
                                    <span>Patente:</span>
                                    <span>{reserva.patente}</span>
                                </li>
                                <li>
                                    <span>Pagado:</span>
                                    <span>${reserva.pago}</span>
                                </li>
                                <li>
                                    <span>Notas:</span>
                                    <span>{reserva.notas}</span>
                                </li>
                            </ul>
                            <span>
                                <button className="btn" onClick={() => mostrarAlerta(reserva.id)}>
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