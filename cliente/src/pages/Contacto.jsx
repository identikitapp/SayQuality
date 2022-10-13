import { useState, useEffect } from 'react'
import logoColor from '../assets/logoColor.png'

export function Contacto() {
	
	const [user, setUser] = useState('')
	const [email, setEmail] = useState('')
	const [subject, setSubject] = useState('')
	const [message, setMessage] = useState('')

	
	  
	const borrarFormulario = () => {
		setUser('')
		setEmail('')
		setSubject('')
		setMessage('')
	}

	

	const enviarFormulario = async () => {
		
		const data = {
			username: user.trim(),
			email: email.trim(),
			subject: subject.trim(),
			message: message.trim()		
		}

		const url = import.meta.env.VITE_URL_REGISTARSE

		await fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(response => response.json())
			.then(result => console.log(result))
	}

	function validarUser() {
		const userRegEx = /^[A-Z][a-z]{3,10}\ [A-Z][a-z]{3,10}$/

		if (user.length !== 0) {
			if (userRegEx.test(user)) {
				const input = document.getElementById('user-contacto')
				input.classList.remove('invalid')
				const mensaje = document.getElementById('error-user')
				mensaje.style.display = 'none'
				return true
			} else {
				const input = document.getElementById('user-contacto')
				input.classList.add('invalid')
				const mensaje = document.getElementById('error-user')
				mensaje.style.display = 'block'
				return false
			}
		}
	}

	useEffect(() => {
		validarUser()
	}, [user])

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
		const messageRegEx = /^[a-zA-Z ]*$/

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
		if (validarUser() && validarEmail() && validarSubject() && validarMessage() ) {
			return true
		}

		return false
	}

	function handleSubmit(e) {
		e.preventDefault()

		if (validarFormulario()) {
			enviarFormulario()
			borrarFormulario()
			alert('Formulario enviado')
			console.log('Formulario enviado')
		} else {
			alert('No es posible enviar el formulario')
			console.error('No es posible enviar el formulario')
		}
	}


		
		return (
		<section className="contacto">

				<div className='contenido'>
					<img src={logoColor} alt="Logo Say Quality" loading='lazy' />
					{/* <p>Para inscribirse a un curso en específico, completar el formulario con los datos solicitados y nos pondremos en contacto a la brevedad</p>	 */}
				</div>
				
				
				
			<form method='POST' className='formulario' onSubmit={e => handleSubmit(e)} autoComplete="off">
				<legend>Completa el formulario con tus datos</legend>

				<span id='error-user'>
					El usuario que ingreso es invalido, recuerde usar las mayusculas corespondientes
					y un espacio entre su nombre y apellido.
				</span>
				<label htmlFor='nombre'>Nombre</label>
				<input
					id='user-contacto'
					type='text'
					name='name'
					placeholder=' Ingresa tu nombre'
					onChange={e => setUser(e.target.value)}
					value={user}
					
				/>

				<span id='error-email'>El email que ingreso es invalido.</span>
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

				<span id='error-message'>El mensaje solo debe contener letras en mayúsculas y minúsculas</span>
				<label htmlFor='Mensaje'>Mensaje</label>
				<textarea
					id='message'
					name='message'
					placeholder=' Escribe tu mensaje'
					onChange={e => setMessage(e.target.value)}
					value={message}
					
				/>

				<button className='btn' value='enviar' name='enviar'>
					Enviar
				</button>
			</form>
		</section>
	)
}
