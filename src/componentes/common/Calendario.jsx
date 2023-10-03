import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { DateRangePicker } from 'react-date-range';
import es from 'date-fns/locale/es';
import { addDays, startOfDay, isSameDay } from 'date-fns'; // Importa funciones de date-fns

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import "../../styles/calendario.css"

function Calendario({ onFechasSeleccionadas }) {

  const { idBungalow } = useParams();

  const bungalowId = parseInt(idBungalow);

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    onFechasSeleccionadas(startDate, endDate);
    setDateRange([ranges.selection]);
  };

  const today = addDays(startOfDay(new Date()), 3);

  const [disabledDates, setDisableDates] = useState([

  ])

  const token = localStorage.getItem('accessToken');

  const obtenerReservas = async (bungalowId) => {

    try {
      const response = await fetch(`https://termas-server.vercel.app/api/events/filtrar?bungalow=${bungalowId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-token': token
        },
      })

      if (response.status === 200) {

        const data = await response.json();
        const reservas = data.eventos;
        const fechasTomadas = [];

        // Mapea los datos para extraer las fechas de las reservas
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

  useEffect(() => {
    obtenerReservas(bungalowId);
  }, [bungalowId])

  const isDateDisabled = (date) => {
    // Verifica si la fecha está en el arreglo de fechas deshabilitadas
    return disabledDates.some((disabledDate) =>
      isSameDay(disabledDate, date)
    );
  };

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