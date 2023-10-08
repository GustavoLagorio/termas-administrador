import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../styles/login.css';

export const Login = () => {  

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {      
      const response = await fetch('https://termas-server.vercel.app/api/auth', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
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
