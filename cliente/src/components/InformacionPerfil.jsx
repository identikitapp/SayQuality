import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { Loader } from './Loader'
import createHeader from '../utils/createHeader'

export const InformacionPerfil = () => {

  	const [cursos, setCursos] = useState([])

	useCallback (() => {

		const url = import.meta.env.VITE_URL_USER

		fetch(url, {
			method: 'GET',
			headers: createHeader(),
		})
			.then(response => response.json())
			.then(result => {
				if (result.data) {
					return setCursos(result.courses)
				}
			})
	}, [])

  return (
		
        <div className='cursos_informacion'>
                <p>Todo</p><span>|</span>
                <p>En curso</p><span>|</span>
                <p>Finalizado</p><span>|</span>
                <p>Aprobado</p><span>|</span>
                <p>Desaprobado</p>       
        </div>
  )
}
