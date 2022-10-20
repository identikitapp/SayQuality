import React from 'react'
import { Aside } from '../components/Aside'
import { InformacionPerfil } from '../components/InformacionPerfil'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import createHeader from '../utils/createHeader'

export const CuestionarioPerfil = () => {
	const navigate = useNavigate()


	useEffect(() => {
        if (localStorage.getItem('token')) {
            const url = import.meta.env.VITE_URL_USER

            fetch(url, {
                method: 'GET',
                headers: createHeader(),
            })
                .then(response => {
					if (response.ok) {
					return	navigate("/cuestionario")
					} 
					return navigate ("/acceder")
				})
        	}
    }, [])

	return (
		<div className='contenedor_perfil'>
			<Aside />
			<section className='panel_informacion'>
				<InformacionPerfil />
				<p>No hay Cuestionarios disponibles!</p>
			</section>
		</div>
	)
}
