import { Link } from 'react-router-dom';
import '../../styles/navbar.css';

export const Navbar = () => {

  //El logo navega al menu de Bungalows y si no es un usuario valido navega al login
  return (
    <header>
      <nav>
        <Link className="logo" to={'/bungalows'}>
          <img src="/logo.png" />
        </Link>
        <div className="titulo">
          <p>Amanecer en Termas</p>
          <p>Bungalows Basavilbaso</p>
        </div>
      </nav>
    </header>
  )
}
