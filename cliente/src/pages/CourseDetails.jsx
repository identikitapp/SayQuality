import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
// import Swal from 'sweetalert2'
import { Loader } from '../components/Loader'
import createHeader from '../utils/createHeader'
import { AiFillFileText, AiFillLock } from 'react-icons/ai'

export function CourseDetails() {
	const [user, setUser] = useState(false)
	const [curso, setCurso] = useState()
	const [loading, setLoading] = useState(true)

	const navigate = useNavigate()
	const { name } = useParams()

	useEffect(() => {
		const url = import.meta.env.VITE_URL_USER

		fetch(url, {
			method: 'GET',
			headers: createHeader(),
		}).then(response => {
			if (!response.ok) {
				return navigate('/acceder')
			}

			setUser(true)
		})
	}, [])

	useEffect(() => {
		const url = import.meta.env.VITE_URL_COURSE + name

		fetch(url, {
			method: 'GET',
			headers: createHeader(),
		})
			.then(response => response.json())
			.then(result => setCurso(result.data.course))
			.then(() => setLoading(false))
	}, [user])

	if (loading) {
		return <Loader />
	}

	function handleSubmit(e) {
		e.preventDefault()

		console.log('Curso comprado')
	}

	return (
		<section className='courseDetails'>
			<article>
				<img
					src={import.meta.env.VITE_URL_IMG + curso.picture}
					alt={curso.name}
					loading='lazy'
					width={300}
					height={250}
				/>
				<div>
					<h1>{curso.name}</h1>
					<strong>Duracion:</strong> <span>{curso.estimatedTime} horas</span>
					<strong>Audiencia objetivo:</strong>
					<span>{curso.target.toLowerCase().replaceAll('\n', ', ')}</span>
					<strong>Requisitos del curso:</strong>
					<span>{curso.requirements.toLowerCase().replaceAll('\n', ', ')}</span>
					<strong>Precio: U$D{curso.price}</strong>
					<form onSubmit={e => handleSubmit(e)}>
						<button type='submit'>Adquirir curso</button>
					</form>
				</div>
			</article>
			<div>
				{curso.stages.map(stage => {
					return (
						<ul key={stage.ID}>
							<p>
								Unidad {stage.number}: {stage.name}
							</p>
							{stage.chapters.map(chapter => {
								return (
									<li key={chapter.ID} className='course-content-list'>
										<AiFillFileText />
										<p>{chapter.name}</p>
										<AiFillLock size={20} />
									</li>
								)
							})}
						</ul>
					)
				})}
			</div>
		</section>
	)
}
