import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BsEyeSlash, BsEye } from 'react-icons/bs'
import Swal from 'sweetalert2'

export function PasswordVerify() {
	const [searchParams] = useSearchParams()
	const [code, setCode] = useState('')
	const [password, setPassword] = useState('')
	const [password2, setPassword2] = useState('')
	const [passwordType, setPasswordType] = useState(true)
	const [passwordType2, setPasswordType2] = useState(true)

	useEffect(() => {
		const code = searchParams.get('code')

		setCode(code)
	}, [])

	const borrarFormulario = () => {
		setPassword('')
		setPassword2('')
	}

	const enviarFormulario = async () => {
		const data = {
			code: code,
			password: password.trim(),
		}

		const url = import.meta.env.VITE_URL_PASSWORD_VERIFY

		await fetch(url, {
			method: 'PATCH',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
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

				borrarFormulario()

				Swal.fire({
					icon: 'success',
					title: result.data.message,
					confirmButtonColor: '#0083bb',
				})
			})
	}

	function validarPassword() {
		const passwordRegEx = /^.{5,50}$/

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

	function validarFormulario() {
		if (validarPassword() && validarPassword2()) {
			return true
		}

		return false
	}

	function handleSubmit(e) {
		e.preventDefault()

		if (!validarFormulario()) {
			return Swal.fire({
				icon: 'error',
				title: 'Por favor, complete el formulario correctamente',
				confirmButtonColor: '#0083bb',
			})
		}

		enviarFormulario()
	}

	return (
		<section className='verify'>
			<form className='formVerify' onSubmit={e => handleSubmit(e)}>
				<span id='error-password-input'>La contraseña que ingreso es invalida</span>
				<span id='error-password2-input'>
					La contraseña que ingreso no coincide con la anterior
				</span>
				<div className='passwordContainer'>
					<input
						id='password'
						type='password'
						name='password'
						placeholder='Nueva contraseña'
						onChange={e => setPassword(e.target.value)}
						value={password}
						onPaste={e => {
							e.preventDefault()
							return false
						}}
						onCopy={e => {
							e.preventDefault()
							return false
						}}
					/>
					{passwordType === true ? (
						<BsEyeSlash
							onClick={mostrarContrasena}
							className='mostrarContraseña'
							size={20}
						/>
					) : (
						<BsEye onClick={mostrarContrasena} className='mostrarContraseña' size={20} />
					)}
				</div>
				<div className='passwordContainer'>
					<input
						id='password2'
						type='password'
						placeholder='Repetir contraseña'
						onChange={e => setPassword2(e.target.value)}
						value={password2}
						onPaste={e => {
							e.preventDefault()
							return false
						}}
						onCopy={e => {
							e.preventDefault()
							return false
						}}
					/>
					{passwordType2 === true ? (
						<BsEyeSlash
							onClick={mostrarContrasena2}
							className='mostrarContraseña'
							size={20}
						/>
					) : (
						<BsEye onClick={mostrarContrasena2} className='mostrarContraseña' size={20} />
					)}
				</div>
				<button type='submit'>Restablecer contraseña</button>
			</form>
		</section>
	)
}
