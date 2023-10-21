import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { DateRangePicker } from 'react-date-range';
import es from 'date-fns/locale/es';
import { addDays, startOfDay, isSameDay } from 'date-fns'; // Importa funciones de date-fns
 

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import "../../styles/calendario.css"

//Recibe como parametros una funcion del componente Bungalow para manejar las fechas seleccionadas
function Calendario({ onFechasSeleccionadas }) {

   

  //Obtenemos idBungalows de la URL como parametro para identificar que bungalow seleccionamos
  //tambien paeseamos ese valor porque es string
  const { idBungalow } = useParams();
  const bungalowId = parseInt(idBungalow);

  //Se declara un estado que controla el rango de fechas seleccionadas
  const [dateRange, setDateRange] = useState([

    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },

  ]);

  //Declaramos el estado que maneja las fechas desabilitadas
  const [disabledDates, setDisableDates] = useState([])

  //Obtenemos el token revalidado
  const token = localStorage.getItem('accessToken');

  //Maneja la seleccion de fechas del calendario
  const handleSelect = (ranges) => {

    const { startDate, endDate } = ranges.selection;
    //Ejecutamos la funcion que proviene de Bungalow para guardar las fechas seleccionadas
    onFechasSeleccionadas(startDate, endDate);
    setDateRange([ranges.selection]);

  };

  //Declaramos como today el dia de la fecha mas 2 dias para esperar acreditacion del pago de reserva
  const today = addDays(startOfDay(new Date()), 0);


  //Obtenemos las reservas
  const obtenerReservas = async (bungalowId) => {

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/events/filtrar?idBungalow=${bungalowId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-token': token
        },
      })

      if (response.status === 200) {

        //Si la respuesta es 200 guardamos las fechas de la reservas en fechas tomadas para actualizar
        //las fechas desabilitadas
        const data = await response.json();
        const reservas = data.eventos;
        const fechasTomadas = [reservas.rangeDates];
        setDisableDates([...disabledDates, ...fechasTomadas]);

        //Mapea los datos para extraer las fechas de las reservas y agregamos como array cada dia entre las fechas de reserva
        reservas.forEach(reserva => {
          const startDate = new Date(reserva.startDate);
          const endDate = new Date(reserva.endDate);

          for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
            fechasTomadas.push(new Date(currentDate));
          }

          setDisableDates([...disabledDates, ...fechasTomadas])

        });

        return fechasTomadas;

      } else {

        console.error('Error al obtener las reservas:', response.statusText);

      }
    } catch (error) {

      console.log(error);

    }

  };

  //Usamos useEffect con parametro bungalowId para que se ejecute la funcion obtenerReservas
  //cuando cambia el bungalowId
  useEffect(() => {
    obtenerReservas(bungalowId);
  }, [bungalowId])

  const isDateDisabled = (date) => {

    // Verifica si la fecha está en el arreglo de fechas deshabilitadas
    return disabledDates.some((disabledDate) =>
      isSameDay(disabledDate, date)
    );

  };

  //datProps recorre cada fecha desde el valor minimo al maximo y controla si esta desabilitada
  return (
    <div>
      <DateRangePicker
        ranges={dateRange}
        onChange={handleSelect}
        minDate={today}
        locale={es}
        disabledDates={disabledDates}
        rangeColors={['#FF5D5D']}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={1}
        direction="horizontal"
        editableDateInputs={true}
        dayProps={(date) => ({
          disabled: isDateDisabled(date),
        })}
      />
    </div>
  );
}

export default Calendario;