import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader } from '../components/Loader'
import { Empty } from '../components/Empty'
import createHeader from '../utils/createHeader'

export function TakeCourse() {
	const [courses, setCourses] = useState([])
	const [loading, setLoading] = useState(true)

	const navigate = useNavigate()
	const { name } = useParams()

	useEffect(() => {
		const url = import.meta.env.VITE_URL_USER

		fetch(url, {
			method: 'GET',
			headers: createHeader(),
		})
			.then(response => {
				if (!response.ok) {
					return navigate('/acceder')
				}

				return response.json()
			})
			.then(result => {
				setCourses(result.data.user.courses)
				setLoading(false)
			})
	}, [])

	async function getFile(stage, file) {
		const url = import.meta.env.VITE_URL_DOWNLOAD + stage + '/' + file + '.pdf'

		await fetch(url, {
			method: 'GET',
			headers: createHeader(),
		})
			.then(response => response.blob())
			.then(response => {
				const a = document.createElement('a')
				const objectUrl = window.URL.createObjectURL(response)
				a.href = objectUrl
				a.download = file + '.pdf'

				const container = document.querySelector('.materialContainer')

				a.style.display = 'none'

				container.appendChild(a)

				a.click()
				a.remove()
			})
	}

	if (loading) {
		return <Loader />
	}

	if (courses.length === 0) {
		return <Empty />
	}

	return (
		<section className='takeCourseContainer'>
			{courses.filter(course => course.name === name) ? (
				<div>
					{courses.map((course, index) => (
						<div key={index}>
							<h1>{course.name}</h1>
							{course.stages.map((stage, index) => (
								<div key={index}>
									<h2>Unidad {stage.name}</h2>
									{stage.chapters.map((chapter, index) => (
										<div key={index} className='materialContainer'>
											<h3>Capítulo {chapter.name}</h3>

											{/* <span>No hay material disponible</span> */}

											{chapter.files !== null && !chapter.files.includes('.pdf') ? (
												<button
													type='button'
													onClick={() => getFile(stage.ID, chapter.files)}
												>
													Descargar pdf
												</button>
											) : (
												<video src={chapter.files} controls></video>
											)}
										</div>
									))}
								</div>
							))}
						</div>
					))}
				</div>
			) : (
				<Empty />
			)}
		</section>
	)
}
