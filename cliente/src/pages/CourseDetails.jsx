import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader } from '../components/Loader'
import createHeader from '../utils/createHeader'
import { AiFillFileText, AiFillLock } from 'react-icons/ai'
import { useMercadopago } from 'react-sdk-mercadopago'
import Swal from 'sweetalert2'

export function CourseDetails() {
	const [user, setUser] = useState(false)
	const [curso, setCurso] = useState()
	const [loading, setLoading] = useState(true)
	const [preferenceId, setPreferenceId] = useState(null)
	const [createPayBtn, setCreatePayBtn] = useState(false)

	const navigate = useNavigate()
	const { name } = useParams()

	const mercadopago = useMercadopago.v2(import.meta.env.VITE_URL_PUBLIC_KEY_MP, {
		locale: 'es-AR',
	})

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

	async function handleSubmit(e) {
		e.preventDefault()

		if (!createPayBtn) {
			await fetch(import.meta.env.VITE_URL_COURSE + name + '/payment', {
				method: 'GET',
				headers: createHeader(),
			})
				.then(response => response.json())
				.then(result => setPreferenceId(result.data.preference))
				.then(() => setCreatePayBtn(true))
		}

		if (name === 'testing manual') {
			Swal.fire({
				icon: 'info',
				title: 'El curso ya se encuentra en tu cuenta',
				confirmButtonColor: '#0083bb',
			})
		}
	}

	useEffect(() => {
		if (name !== 'testing manual') {
			if (mercadopago) {
				mercadopago.checkout({
					preference: {
						id: preferenceId,
					},
					render: {
						container: '.payment',
						label: 'Pagar con mercado pago',
					},
				})
			}
		}
	}, [createPayBtn])

	if (loading) {
		return <Loader />
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
					<form className='payment' onSubmit={e => handleSubmit(e)}>
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
