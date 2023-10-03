import { Link } from 'react-router-dom';
import '../../styles/navbar.css';
export const Navbar = () => {
  return (
    <header>
      <nav>
        <Link className="logo" to={'/bungalows'}>
          <img src="../../../public/logo.png" alt="" />
        </Link>
        <div className="titulo">
          <p>Amanecer en Termas</p>
          <p>Bungalows Basavilbaso</p>
        </div>
      </nav>
    </header>
  )
}
