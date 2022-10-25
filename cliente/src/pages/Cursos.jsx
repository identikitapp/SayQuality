import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Loader } from '../components/Loader'
import createHeader from '../utils/createHeader'

export function Cursos() {
	const [cursos, setCursos] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const url = import.meta.env.VITE_URL_COURSES

		fetch(url, {
			method: 'GET',
			headers: createHeader(),
		})
			.then(response => response.json())
			.then(result => {
				if (result.data) {
					return setCursos(result.data.courses)
				}
			})
			.then(() => setLoading(false))
	}, [])

	if (loading) {
		return <Loader />
	}

	return (
		<section className='cursosContainer'>
			{cursos.map((curso, index) => (
				<article key={index} className='cursoCard'>
					<img
						src={import.meta.env.VITE_URL_IMG + curso.picture}
						alt={curso.name}
						loading='lazy'
						width={300}
						height={250}
					/>
					<div>
						<h2>{curso.name}</h2>
						<p>{curso.description}</p>
						<strong>U$D {curso.price}</strong>
						<Link to={'/cursos/' + curso.name}>Inscribirme</Link>
					</div>
				</article>
			))}
		</section>
	)
}
