import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'

export function Navbar() {
	return (
		<nav className='navbar'>
			<Link to='/' className='logo'> <img src={logo}></img> </Link>
			<ul>
				<li>
					<NavLink to="/cursos" className={({isActive}) => isActive ? "active" : ""}>Cursos</NavLink>
				</li>
				<li>
					<NavLink to="/equipo" className={({isActive}) => isActive ? "active" : ""}>Equipo</NavLink>
				</li>
				<li>
					<NavLink to="/contacto" className={({isActive}) => isActive ? "active" : ""}>Contacto</NavLink>
				</li>
			</ul>
			
			<NavLink to="/acceder" className={({isActive}) => isActive ? "active" : ""}>Acceder</NavLink>
		</nav>
	)
}

