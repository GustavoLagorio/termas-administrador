import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../styles/login.css';


export const Login = () => {

  //Estructura del formulario de login
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  //Toma los cambios del input y los carga en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //Envia el formulario al servidor
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {      
      console.log(import.meta.env.VITE_API_URL);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth`, {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      //Si la respuesta es 200 devuelve un JWT que se guarda en el localStorage para posteriores validaciones
      if(response.status === 200) {
        //obtencion del token
        const { token } = await response.json();

        //guardar el token
        localStorage.setItem('accessToken', token);
        
        return navigate("/bungalows");
      } else {
        console.error('Inicio de sesión fallido');
      }

    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };


  return (
    //El formulario toma los valores del formulario declarado al inicio del componente
    <main className='login'>
        <h1>Login Administrador</h1>        
        <form action="" onSubmit={handleSubmit}>
            <input type="email" name='email' required value={formData.email} onChange={handleChange} placeholder='Email'/>
            <input type="password" name='password' required value={formData.password} onChange={handleChange} placeholder='Contraseña'/>
            {/* alerta */}
            <button type='submit'>Ingresar</button>
        </form>        
    </main>
  )
}
