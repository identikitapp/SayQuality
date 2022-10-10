import React, { useState, useEffect } from 'react'
import logoContacto from '../assets/logoContacto.png'

export const RecuperarPassword = () => {
	const [correo, setCorreo] = useState('')

	const enviarFormulario = async () => {
		const data = {
			email: correo.trim(),
		}

		const url = process.env.REACT_APP_URL_PASSWORD_RECOVERY

		await fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(response => response.JSON())
			.then(result => console.log(result))

		setCorreo('')
	}

	function validarFormulario() {
		const emailRegEx = /^[\w\.\-]+@([\w-]+\.)+[\w-]{2,4}$/

		if (correo.length !== 0) {
			if (emailRegEx.test(correo)) {
				const input = document.getElementById('correo')
				input.classList.remove('invalid')
				const mensaje = document.getElementById('mensaje')
				mensaje.style.display = 'none'
				return true
			} else {
				const input = document.getElementById('correo')
				input.classList.add('invalid')
				const mensaje = document.getElementById('mensaje')
				mensaje.style.display = 'block'
				return false
			}
		}
	}

	useEffect(() => {
		validarFormulario()
	}, [correo])

	function handleSubmit(e) {
		e.preventDefault()

		if (validarFormulario() && correo !== '') {
			enviarFormulario()
		} else {
			console.error('No es posible enviar el formulario')
			// alert('No es posible enviar el formulario')
		}
	}

	return (
		<section className='acceder'>
			<div className='logo'>
				<img src={logoContacto} alt='logo' />
			</div>
			<div className='iniciar-sesion'>
				<form className='formulario_recuperar' onSubmit={e => handleSubmit(e)}>
					<p className='instrucciones'>
						Por favor, introduce tu correo electrónico. Recibiras un mensaje con
						instrucciones sobre como restablecer tu contraseña.
					</p>
					<span id='mensaje' className='mensaje'>
						El correo ingresado no es valido.
					</span>
					<input
						id='correo'
						className='correo'
						type='email'
						name='email'
						placeholder='Correo Electrónico'
						onChange={e => setCorreo(e.target.value)}
						value={correo}
					/>
					<button className='recuperar' type='submit'>
						Recuperar Contraseña
					</button>
				</form>
			</div>
		</section>
	)
}
