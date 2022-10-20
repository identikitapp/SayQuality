import React from 'react'
import { Aside } from '../components/Aside'
import { Buttons } from '../components/Buttons'
import { InformacionPerfil } from '../components/InformacionPerfil'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import createHeader from '../utils/createHeader'

export const Perfil = () => {
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
					return	navigate("/perfil")
					} 
					return navigate ("/acceder")
				})
        	}
    }, [])
	return (
		<div className='contenedor_perfil'>
			<Aside />
			<section className='panel_informacion'>
				<Buttons />
				<InformacionPerfil />
			</section>
		</div>
	)
}
