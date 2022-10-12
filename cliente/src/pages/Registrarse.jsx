import React, { useState, useEffect } from 'react'
import logoColor from '../assets/logoColor.png'
import { BsEye, BsEyeSlash } from 'react-icons/bs'

export const Registrarse = () => {
	const [user, setUser] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [password2, setPassword2] = useState('')
	const [passwordType, setPasswordType] = useState(true)
	const [passwordType2, setPasswordType2] = useState(true)

	const enviarFormulario = async () => {
		const data = {
			user: user.trim(),
			email: email.trim(),
			password: password.trim(),
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

		setUser('')
		setEmail('')
		setPassword('')
	}

	function validarUser() {
		const userRegEx = /^[A-Z][a-z]{3,10}\ [A-Z][a-z]{3,10}$/

		if (user.length !== 0) {
			if (userRegEx.test(user)) {
				const input = document.getElementById('user')
				input.classList.remove('invalid')
				const mensaje = document.getElementById('error-user-input')
				mensaje.style.display = 'none'
				return true
			} else {
				const input = document.getElementById('user')
				input.classList.add('invalid')
				const mensaje = document.getElementById('error-user-input')
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
				const input = document.getElementById('email')
				input.classList.remove('invalid')
				const mensaje = document.getElementById('error-email-input')
				mensaje.style.display = 'none'
				return true
			} else {
				const input = document.getElementById('email')
				input.classList.add('invalid')
				const mensaje = document.getElementById('error-email-input')
				mensaje.style.display = 'block'
				return false
			}
		}
	}

	useEffect(() => {
		validarEmail()
	}, [email])

	function validarPassword() {
		const passwordRegEx = /^([a-zA-Z0-9]){7,}([!@#$%^&*]){1,}$/

		if (password.length !== 0) {
			if (passwordRegEx.test(password)) {
				const input = document.getElementById('password')
				input.classList.remove('invalid')
				const mensaje = document.getElementById('error-password-input')
				mensaje.style.display = 'none'
				return true
			} else {
				const input = document.getElementById('password')
				input.classList.add('invalid')
				const mensaje = document.getElementById('error-password-input')
				mensaje.style.display = 'block'
				return false
			}
		}
	}

	useEffect(() => {
		validarPassword()
	}, [password])

	function validarPassword2() {
		if (password2.length !== 0) {
			if (password2 === password) {
				const input = document.getElementById('password2')
				input.classList.remove('invalid')
				const mensaje = document.getElementById('error-password2-input')
				mensaje.style.display = 'none'
				return true
			} else {
				const input = document.getElementById('password2')
				input.classList.add('invalid')
				const mensaje = document.getElementById('error-password2-input')
				mensaje.style.display = 'block'
				return false
			}
		}
	}

	useEffect(() => {
		validarPassword2()
	}, [password2])

	function validarFormulario() {
		validarUser()
		validarEmail()
		validarPassword()
		validarPassword2()
	}

	function handleSubmit(e) {
		e.preventDefault()

		if (validarFormulario()) {
			enviarFormulario()
		} else {
			alert('No es posible enviar el formulario')
			console.error('No es posible enviar el formulario')
		}
	}

	function mostrarContrasena() {
		let passwd = document.getElementById('password')

		if (passwd.type === 'password') {
			passwd.type = 'text'
			setPasswordType(false)
		} else {
			passwd.type = 'password'
			setPasswordType(true)
		}
	}

	function mostrarContrasena2() {
		let passwd2 = document.getElementById('password2')

		if (passwd2.type === 'password') {
			passwd2.type = 'text'
			setPasswordType2(false)
		} else {
			passwd2.type = 'password'
			setPasswordType2(true)
		}
	}

	return (
		<section className='acceder'>
			<div className='logo'>
				<img src={logoColor} alt='logo' />
			</div>
			<div className='iniciar-sesion'>
				<div className='acceder-google'>
					<p>Crea una cuenta</p>
				</div>
				<span id='error-user-input'>El usuario que ingreso es invalido.</span>
				<span id='error-email-input'>El email que ingreso es invalido.</span>
				<span id='error-password-input'>La contraseña que ingreso es invalido.</span>
				<span id='error-password2-input'>
					La contraseña que ingreso no coincide con la anterior.
				</span>
				<form onSubmit={e => handleSubmit(e)}>
					<input
						id='user'
						type='text'
						name='username'
						placeholder='Nombre Completo'
						onChange={e => setUser(e.target.value)}
						value={user}
					/>
					<input
						id='email'
						type='email'
						name='email'
						placeholder='Correo Electrónico'
						onChange={e => setEmail(e.target.value)}
						value={email}
					/>
					<div className='passwordContainer'>
						<input
							id='password'
							type='password'
							name='password'
							placeholder='Contraseña'
							onChange={e => setPassword(e.target.value)}
							value={password}
						/>
						{passwordType === true ? (
							<BsEyeSlash onClick={mostrarContrasena} className='mostrarContraseña' />
						) : (
							<BsEye onClick={mostrarContrasena} className='mostrarContraseña' />
						)}
					</div>
					<div className='passwordContainer'>
						<input
							id='password2'
							type='password'
							placeholder='Repetir contraseña'
							onChange={e => setPassword2(e.target.value)}
							value={password2}
						/>
						{passwordType2 === true ? (
							<BsEyeSlash onClick={mostrarContrasena2} className='mostrarContraseña' />
						) : (
							<BsEye onClick={mostrarContrasena2} className='mostrarContraseña' />
						)}
					</div>
					<button>Iniciar Sesion</button>
				</form>
			</div>
		</section>
	)
}
