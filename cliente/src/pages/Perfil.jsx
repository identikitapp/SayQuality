import React, { useCallback } from 'react'
import { Aside } from '../components/Aside'
import { Buttons } from '../components/Buttons'
import { InformacionCursos } from '../components/InformacionCursos'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import createHeader from '../utils/createHeader'
import { Loader } from '../components/Loader'

export const Perfil = () => {
	const navigate = useNavigate()
	const [loading, setLoading] = useState(true)

	useCallback(() => {
		const url = import.meta.env.VITE_URL_USER

		fetch(url, {
			method: 'GET',
			headers: createHeader(),
		})
			.then(response => {
				if (response.ok) {
					return navigate('/perfil')
				}
				return navigate('/acceder')
			})
			.then(() => setLoading(false))
	}, [])

	return (
		<div className='contenedor_perfil'>
			<Aside />
			<section className='panel_informacion'>
				<Buttons />
				<InformacionCursos />
			</section>
		</div>
	)
}
