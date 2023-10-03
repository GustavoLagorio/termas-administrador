import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import './styles/global.css'

import { Login } from '../src/componentes/pages/Login';
import { Error404 } from "./componentes/pages/Error404";
import Layout from "./componentes/common/Layout";
import { BungalowsAuth } from "./componentes/routes-auth/Bungalows-auth";
import { BungalowAuth } from './componentes/routes-auth/Bungalow-auth';
import { EditarBungalowAuth } from "./componentes/routes-auth/Editar-bungalow-auth";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const router = createBrowserRouter([
  {
    path: "/" /* creamos nuestro path root o raiz */,
    element: <Layout />, //* tendra el elemento a renderizar que sera Layout (es proporcionar una estructura común para los componentes de la aplicación y definir elementos visuales o funcionales que se repiten en todas o varias partes de la interfaz. )
    children: [
      {
        index: true, //* esta es la pagina que se va a mostrar como raiz
        element: <Login /> //* componente que se va a mostrar
      },
      {
        path: "/bungalows", //* cuando entramos a la url
        element: <BungalowsAuth/>, //* renderizamos este componente,
        errorElement: <Error404 /> //* si la pagina no existe mostramos este componente
      },
      {
        path: "/bungalows/:idBungalow/", //* cuando entramos a la url
        element: <BungalowAuth />, //* renderizamos este componente,
        errorElement: <Error404 /> //* si la pagina no existe mostramos este componente
      },
      {
        path: "/bungalows/:idBungalow/editar-bungalow", //* cuando entramos a la url
        element: <EditarBungalowAuth />, //* renderizamos este componente,
        errorElement: <Error404 /> //* si la pagina no existe mostramos este componente
      },
      {
        path: "*", //* cualquier pagina que no sea la root o la /pagina/nueva
        element: <Error404 /> //*  renderiza error
      }
    ]
  }
]);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);