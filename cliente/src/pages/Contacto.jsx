import { useState, useEffect } from 'react'
import logoWhite from '../assets/logoWhite.png'
import Swal from 'sweetalert2'
import createHeader from '../utils/createHeader'

export function Contacto() {
	const [email, setEmail] = useState('')
	const [subject, setSubject] = useState('')
	const [message, setMessage] = useState('')
	const [options, setOptions] = useState(0)
	const [lawyer, setLawyer] = useState('')

	const borrarFormulario = () => {
		setEmail('')
		setSubject('')
		setMessage('')
		setOptions(0)
		setLawyer('')
	}

	const enviarFormulario = async () => {
		const data = {
			email: email.trim(),
			subject: subject.trim(),
			text: message.trim(),
			form: options,
			lawyer: new Boolean(lawyer),
		}

		const url = import.meta.env.VITE_URL_CONTACT_FORM

		await fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: createHeader(),
		})
			.then(response => response.json())
			.then(result => {
				if (!result.data) {
					return Swal.fire({
						icon: 'error',
						title: result.error.message,
						confirmButtonColor: '#0083bb',
					})
				}

				console.log(result)

				Swal.fire({
					icon: 'success',
					title: result.data.message,
					confirmButtonColor: '#0083bb',
				})
			})
	}

	function validarEmail() {
		const emailRegEx = /^[\w\.\-]+@([\w-]+\.)+[\w-]{2,4}$/

		if (email.length !== 0) {
			if (emailRegEx.test(email)) {
				const input = document.getElementById('email-contacto')
				input.classList.remove('invalid')
				const mensaje = document.getElementById('error-email')
				mensaje.style.display = 'none'
				return true
			} else {
				const input = document.getElementById('email-contacto')
				input.classList.add('invalid')
				const mensaje = document.getElementById('error-email')
				mensaje.style.display = 'block'
				return false
			}
		}
	}

	useEffect(() => {
		validarEmail()
	}, [email])

	function validarSubject() {
		const subjectRegEx = /^[a-zA-Z ]*$/

		if (subject.length !== 0) {
			if (subjectRegEx.test(subject)) {
				const input = document.getElementById('subject')
				input.classList.remove('invalid')
				const mensaje = document.getElementById('error-subject')
				mensaje.style.display = 'none'
				return true
			} else {
				const input = document.getElementById('subject')
				input.classList.add('invalid')
				const mensaje = document.getElementById('error-subject')
				mensaje.style.display = 'block'
				return false
			}
		}
	}

	useEffect(() => {
		validarSubject()
	}, [subject])

	function validarMessage() {
		const messageRegEx = /^[a-zA-Z0-9\ ]*$/

		if (message.length !== 0) {
			if (messageRegEx.test(message)) {
				const input = document.getElementById('message')
				input.classList.remove('invalid')
				const mensaje = document.getElementById('error-message')
				mensaje.style.display = 'none'
				return true
			} else {
				const input = document.getElementById('message')
				input.classList.add('invalid')
				const mensaje = document.getElementById('error-message')
				mensaje.style.display = 'block'
				return false
			}
		}
	}

	useEffect(() => {
		validarMessage()
	}, [message])

	function validarFormulario() {
		if (validarEmail() && validarSubject() && validarMessage()) {
			return true
		}

		return false
	}

	function handleSubmit(e) {
		e.preventDefault()

		if (validarFormulario()) {
			enviarFormulario()
			borrarFormulario()
		}

		return Swal.fire({
			icon: 'error',
			title: 'Por favor, complete el formulario correctamente',
			confirmButtonColor: '#0083bb',
		})
	}

	return (
		<section className='contacto'>
			<div className='contenido'>
				<img src={logoWhite} alt='Logo Say Quality' loading='lazy' />
			</div>

			<form
				method='POST'
				className='formulario'
				onSubmit={e => handleSubmit(e)}
				autoComplete='off'
			>
				<legend>Completa el formulario con tus datos</legend>

				<span id='error-email'>El email que ingreso es invalido</span>
				<label htmlFor='Email'>Email</label>
				<input
					id='email-contacto'
					type='email'
					name='email'
					placeholder=' Ingresa tu email'
					onChange={e => setEmail(e.target.value)}
					value={email}
				/>
				<span id='error-subject'>
					El asunto admite solo letras en minúsculas y mayusculas
				</span>
				<label htmlFor='Asunto'>Asunto</label>
				<input
					id='subject'
					type='text'
					name='subject'
					placeholder=' Ingresa un asunto'
					onChange={e => setSubject(e.target.value)}
					value={subject}
				/>

				<span id='error-message'>El mensaje no debe contener caracteres especiales</span>
				<label htmlFor='Mensaje'>Mensaje</label>
				<textarea
					id='message'
					name='text'
					placeholder=' Escribe tu mensaje'
					onChange={e => setMessage(e.target.value)}
					value={message}
				/>
				<label htmlFor='Motivo' className='motivo'>
					Motivo
				</label>
				<select
					className='options'
					name='form'
					onChange={e => setOptions(e.target.value)}
					value={options}
				>
					<option value='0'> Problemas o dudas con mi cuenta</option>
					<option value='1'> Problemas o dudas con mi compra</option>
					<option value='2'> Problemas o dudas de seguridad</option>
					<option value='3'> Contacto legal</option>
					<option value='4'> Contacto empresarial</option>
					<option value='5'> Otro</option>
				</select>

				<label className='lawyer'>
					Soy el representante legal de la persona u organizacion que contacta
					<input
						type='checkbox'
						name='lawyer'
						onChange={e => setLawyer(e.target.checked)}
						value={lawyer}
					/>
				</label>

				<button className='btn' value='enviar' name='enviar'>
					{' '}
					Enviar{' '}
				</button>
			</form>
		</section>
	)
}
