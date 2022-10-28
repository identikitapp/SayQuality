import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { Cursos } from '../pages/Cursos'
import createHeader from '../utils/createHeader'

export const InformacionCursos= () => {

	const [courses, setCourses] = useState([
		{
            "name": "testing e2e con cypress",
            "teacherID": 3,
            "description": "La automatización de pruebas consiste en el uso de software especializado para controlar su ejecución y comparar los resultados obtenidos con los resultados esperados. La automatización de pruebas permite incluir pruebas repetitivas y necesarias dentro de un proceso formal de pruebas ya existente o bien adicionar pruebas cuya ejecución manual resultaría difícil. En este curso aprenderas Cypress. Cypress es un framework de testing front-end revolucionario y moderno que permite escribir fácilmente pruebas potentes y flexibles para aplicaciones web.",
            "target": "Testers Manuales\nAnalistas QA\nPúblico en General",
            "price": 80,
            "picture": "16c0de1abb7089c9b180d38hashHackedCypressCursoac537c964e6980b9780",
            "currency": "USD",
            "requirements": "Testing manual\nRegresiones\nPruebas de Humo\nTesting Exploratorio",
            "level": 0,
            "estimatedTime": 22,
            "categories": "Automation\nJavaScript",
            "ID": 2,
		}
	])

	useCallback (() => {
		const url = import.meta.env.VITE_URL_USER

		fetch(url, {
			method: 'GET',
			headers: createHeader(),
		})
			.then(response => response.json())
			.then(result => {
				console.log(result)
				if(result.data) {		
					return setCourses(result.data.user.courses)
				}
			})
	}, [])


	

  return (
		
        <div className='cursos_informacion'>
			
			{courses.map((curso) => (
				<div key={curso.ID}>
					<li>{curso.name}</li>
					<li>{curso.description}</li>
				</div>
       		 
			 
      		))}   
        </div>
  )
}
