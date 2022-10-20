import React from 'react'
import { useState, useEffect } from 'react'
import { BsFillPlayFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
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
		navigate('/acceder')
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
						<button className='enlaces_secciones' onClick={handleClick0}>
							<BsFillPlayFill className='icon' />
							Cursos
						</button>
						<button className='enlaces_secciones' onClick={handleClick1}>
							<BsFillPlayFill className='icon' />
							Cuestionarios
						</button>
						<button className='enlaces_secciones' onClick={handleClick2}>
							<BsFillPlayFill className='icon' />
							Ajustes
						</button>
						<button className='enlaces_secciones' onClick={logout}>
							<BsFillPlayFill className='icon' />
							Cerrar Sesión
						</button>
					</div>
				</>
			)}
		</aside>
	)
}
