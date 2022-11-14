import React from 'react'
import { useState } from 'react'
import createHeader from '../utils/createHeader'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export const InformacionCursos = () => {
	const [courses, setCourses] = useState([])
	const [user, setUser] = useState('')

	useEffect(() => {
		const url = import.meta.env.VITE_URL_USER

		fetch(url, {
			method: 'GET',
			headers: createHeader(),
		})
			.then(response => response.json())
			.then(result => {
				if (result.data) {
					return setCourses(result.data.user.courses)
				}
			})
	}, [])

	return (
		<div className='cursos_informacion'>
			{user !== null ? (
				courses.map(curso => (
					<Link to={'/perfil/' + curso.name} className='contenedor_cursos' key={curso.ID}>
						<img src={import.meta.env.VITE_URL_IMG + curso.picture} />
						<li className='curso'>{curso.name}</li>
					</Link>
				))
			) : (
				<p>No hay cursos disponibles</p>
			)}
		</div>
	)
}
