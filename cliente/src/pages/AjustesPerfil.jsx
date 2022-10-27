import React from 'react'
import { Ajustes } from '../components/Ajustes'
import { Aside } from '../components/Aside'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import createHeader from '../utils/createHeader'
import { useCallback } from 'react'

export const AjustesPerfil = () => {
	const navigate = useNavigate()


	useCallback(() => {
        if (localStorage.getItem('token')) {
            const url = import.meta.env.VITE_URL_USER

            fetch(url, {
                method: 'GET',
                headers: createHeader(),
            })
                .then(response => {
					if (response.ok) {
					return	navigate("/ajustes")
					} 
					return navigate ("/acceder")
				})
        	}
    }, [])

	
	

	return (
		<div className='contenedor_perfil'>
			<Aside />
			<section className='panel_informacion_ajustes'>
				<Ajustes />
			</section>
		</div>
	)
}
