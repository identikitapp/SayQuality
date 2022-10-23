import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import { FaUserCircle } from 'react-icons/fa'
import { FaBars } from 'react-icons/fa'
import createHeader from '../utils/createHeader'

export function Navbar() {
	const [user, setUser] = useState()

	const toggleMenu = () => {
		const menu = document.querySelector('.nav-menu')
		menu.classList.toggle('nav-menu_active')
	}

	const closeMenu = () => {
		const menu = document.querySelector('.nav-menu')
		menu.classList.remove('nav-menu_active')
	}

	useEffect(() => {
		if (!!localStorage.getItem('token')) {
			const url = import.meta.env.VITE_URL_USER

			fetch(url, {
				method: 'GET',
				headers: createHeader(),
			})
				.then(response => response.json())
				.then(result => setUser(result))
		}
	}, [])

	return (
		<nav className='navbar'>
			<Link to='/' className='logo'>
				<img src={logo}></img>
			</Link>
			<ul className='nav-menu'>
				<li className='nav-menu-item'>
					<Link to='/cursos' className='nav-menu-link' onClick={() => closeMenu()}>
						Cursos
					</Link>
				</li>
				<li className='nav-menu-item'>
					<Link to='/equipo' className='nav-menu-link' onClick={() => closeMenu()}>
						Equipo
					</Link>
				</li>
				<li className='nav-menu-item'>
					<Link to='/contacto' className='nav-menu-link' onClick={() => closeMenu()}>
						Contacto
					</Link>
				</li>
				<li className='conditional-item'>
					{user === undefined || user.error ? (
						<Link to='/acceder' className='accederIcon-link' onClick={() => closeMenu()}>
							<FaUserCircle size={40} />
						</Link>
					) : (
						<Link to='/perfil' className='user-avatar-link' onClick={() => closeMenu()}>
							<img
								className='user-avatar-img'
								src={import.meta.env.VITE_URL_IMG + user.data.user.avatar}
								alt={user.data.user.username}
							></img>
						</Link>
					)}
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

			{user === undefined || user.error ? (
				<Link to='/acceder' className='accederIcon'>
					<FaUserCircle size={35} />
				</Link>
			) : (
				<Link to='/perfil' className='user-avatar'>
					<img
						className='user-avatar-img'
						src={import.meta.env.VITE_URL_IMG + user.data.user.avatar}
						alt={user.data.user.username}
					></img>
				</Link>
			)}
		</nav>
	)
}
