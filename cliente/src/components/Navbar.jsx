import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export function Navbar() {
	return (
		<nav>
			<Link to='/'>
				<img src={logo}></img>
			</Link>
			<ul>
				<li>
					<Link to='/cursos'>Cursos</Link>
				</li>
				<li>
					<Link to='/equipo'>Equipo</Link>
				</li>
				<li>
					<Link to='/contacto'>Contacto</Link>
				</li>
			</ul>
			<Link to='/acceder'>Acceder</Link>
		</nav>
	)
}
