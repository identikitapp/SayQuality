import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import { FaUserCircle } from 'react-icons/fa'
import { FaBars } from 'react-icons/fa'

export function Navbar() {
	const toggleMenu = () => {
		const menu = document.querySelector('.nav-menu')
		menu.classList.toggle('nav-menu_active')
	}

	return (
		<nav className='navbar'>
			<Link to='/' className='logo'>
				<img src={logo}></img>
			</Link>
			<ul className='nav-menu'>
				<li className='nav-menu-item'>
					<Link to='/cursos' className='nav-menu-link'>
						Cursos
					</Link>
				</li>
				<li className='nav-menu-item'>
					<Link to='/equipo' className='nav-menu-link'>
						Equipo
					</Link>
				</li>
				<li className='nav-menu-item'>
					<Link to='/contacto' className='nav-menu-link'>
						Contacto
					</Link>
				</li>
			</ul>
			{
				<button
					className='toggle'
					onClick={() => {
						toggleMenu()
					}}
				>
					<FaBars size={30} />
				</button>
			}
			<Link to='/acceder' className='accederIcon'>
				<FaUserCircle size={35} />
			</Link>
		</nav>
	)
}
