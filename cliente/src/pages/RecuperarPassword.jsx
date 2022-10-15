import React, { useState, useEffect } from 'react'
import logoColor from '../assets/logoColor.png'
import Swal from 'sweetalert2'

export const RecuperarPassword = () => {
	const [correo, setCorreo] = useState('')

	const borrarFormulario = () => {
		setCorreo('')
	}

	const enviarFormulario = async () => {
		const data = {
			email: correo.trim(),
		}

		const url = import.meta.env.VITE_URL_PASSWORD_RECOVERY

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

		if (validarFormulario()) {
			enviarFormulario()
			borrarFormulario()
			Swal.fire({
				icon: 'success',
				title: 'Te hemos enviado un mail, por favor verifica tu bandeja de entrada',
				confirmButtonColor: '#0083bb',
			})
		} else {
			Swal.fire({
				icon: 'error',
				title: 'Ha ocurrido un error',
				confirmButtonColor: '#0083bb',
			})
		}
	}

	return (
		<section className='acceder'>
			<div className='logo-acceder'>
				<img src={logoColor} alt='logo' />
			</div>
			<div className='iniciar-sesion'>
				<form className='formulario_recuperar' onSubmit={e => handleSubmit(e)}>
					<p className='instrucciones'>
						Por favor, introduce tu correo electrónico. Recibiras un mensaje con
						instrucciones sobre como restablecer tu contraseña
					</p>
					<span id='mensaje' className='mensaje'>
						El correo que ingreso es invalido
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
