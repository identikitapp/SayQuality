import React from 'react'
import { useState, useEffect } from 'react'
import { BsFillPlayFill } from 'react-icons/bs'
import { useNavigate, NavLink } from 'react-router-dom'
import createHeader from '../utils/createHeader'

export const Aside = () => {
	const [user, setUser] = useState(null)
	const navigate = useNavigate()

	let handleClick0 = () => {
		navigate('/perfil')
	}
	let handleClick1 = () => {
		navigate('/cuestionario')
	}
	let handleClick2 = () => {
		navigate('/ajustes')
	}
	const logout = () => {
		localStorage.removeItem('token')
		navigate('/')

		location.reload()
	}

	useEffect(() => {
		const url = import.meta.env.VITE_URL_USER

		fetch(url, {
			method: 'GET',
			headers: createHeader(),
		})
			.then(response => response.json())
			.then(result => {
				if (!result.data) {
					return Swal.fire({
						icon: 'error',
						title: result.error.message,
						confirmButtonColor: '#0083bb',
					})
				}

				return setUser(result.data.user)
			})
	}, [])

	return (
		<aside>
			{user === null ? (
				navigate('/acceder')
			) : (
				<>
					<div className='imagen_perfil'>
						<p>Estudiante</p>
						<img src={import.meta.env.VITE_URL_IMG + user.avatar} alt={user.username} />
					</div>
					<div className='secciones'>
						<NavLink
							to='/perfil'
							className={({ isActive }) => (isActive ? 'active' : '')}
						>
							<BsFillPlayFill className='icon' />
							Cursos
						</NavLink>

						<NavLink
							to='/cuestionario'
							className={({ isActive }) => (isActive ? 'active' : '')}
						>
							<BsFillPlayFill className='icon' />
							Cuestionarios
						</NavLink>

						<NavLink
							to='/ajustes'
							className={({ isActive }) => (isActive ? 'active' : '')}
						>
							<BsFillPlayFill className='icon' />
							Ajustes
						</NavLink>

						<NavLink
							to='/acceder'
							className={({ isActive }) => (isActive ? 'active' : '')}
							onClick={logout}
						>
							<BsFillPlayFill className='icon' />
							Cerrar Sesión
						</NavLink>
					</div>
				</>
			)}
		</aside>
	)
}
