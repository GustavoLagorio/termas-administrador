import { useParams } from "react-router-dom";
import listaBungalows from '../../../lista-bungalows.json';

import '../../styles/editar-bungalow.css'


export const EditarBungalows = () => {

  const { _id } = useParams();
  const bungalowSeleccionado = listaBungalows.find(bungalow => bungalow._id === parseInt(_id));

  return (
    <main className="editar">
      <h1>{bungalowSeleccionado.nombre}</h1>
      <p>Completa el campo que desea modificar</p>
      <form action="">
        <label htmlFor="nombre">Nombre:</label>
        <input type="text" name="nombre" placeholder={`${bungalowSeleccionado.nombre}`} />
        <button type="submit">Modificar Campo</button>
      </form>
      <form action="">
        <label htmlFor="precio">Precio:</label>
        <input type="number" name="precio" placeholder="Precio" />
        <button type="submit">Modificar Campo</button>
      </form>
      <form action="" className="descripcion">
        <label htmlFor="descripcion">Descripción:</label>
        <textarea type="text" name="descripcion" placeholder="Texto de la página" />
        <button type="submit">Modificar Campo</button>
      </form>
    </main>
  )
}
