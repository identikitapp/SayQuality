import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import logoColor from '../assets/logoColor.png';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import Swal from 'sweetalert2';
// import createHeader from '../utils/createHeader';
// import {FcGoogle} from 'react-icons/fc';

export function Acceder() {

	const [correo, setCorreo] = useState('');
	const [password, setPassword] = useState('');
	const [passwordType, setPasswordType] = useState(false)

	const enviarFormulario = async () => {
		const data = {
			email: correo.trim(),
			password: password.trim(),
		}

		const url = import.meta.env.VITE_URL_INICIAR_SESION

		await fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json',
			}
		})
			.then(response => response.json())
			.then(result => console.log(result))
	
	}

	function borrarFormulario() {
		setCorreo('')
		setPassword('')
	}
	

	function validarCorreo() {

			const emailRegEx = /^[\w\.\-]+@([\w-]+\.)+[\w-]{2,4}$/

		if(correo.length !== 0) {
			if (emailRegEx.test(correo)) {
				const input = document.getElementById('correo')
				input.classList.remove('invalid')
				const mensaje = document.getElementById('error-email-user')
				mensaje.style.display = 'none'
				return true
			} else {
				const input = document.getElementById('correo')
				input.classList.add('invalid')
				const mensaje = document.getElementById('error-email-user')
				mensaje.style.display = 'block'
				return false
			}
		}
	}

	useEffect(() => {
		validarCorreo()	
	}, [correo])

	function validarPassword() {

		const passwordRegEx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/gm

		if (password.length !== 0) {
			if (passwordRegEx.test(password)) { 
				const input = document.getElementById('password')
				input.classList.remove('invalid')
				const mensaje = document.getElementById('error-password-user')
				mensaje.style.display = 'none'
				return true
			} else {
				const input = document.getElementById('password')
				input.classList.add('invalid')
				const mensaje = document.getElementById('error-password-user')
				mensaje.style.display = 'block'
				return false
		}
	}
}
	
	useEffect( () => {
		validarPassword()
	}, [password])

	function validarFormulario() {
			if(validarCorreo() && validarPassword())
			return true
	}

	function handleSubmit(e) {
		e.preventDefault()

		if (validarFormulario()) {
			enviarFormulario()
			borrarFormulario()
			Swal.fire({
				icon: 'success', 
				title: 'Se ha iniciado sesión con éxito',
				confirmButtonColor: '#0083bb'
			})
		} else {
			Swal.fire({
				icon: 'error', 
				title: 'Hubo un error al iniciar sesión',
				confirmButtonColor: '#0083bb'
			})
		}
	}
	
	function mostrarContrasena() {

        let tipo = document.getElementById('password')

        if (tipo.type === 'password') {
            tipo.type = 'text'
            setPasswordType(true)
        } else {
            tipo.type = 'password'
            setPasswordType(false)
        }
    }
	
	return (
		<section className='acceder'>

			<div className='logo-acceder'>
				<img src={logoColor} alt="logo" />
			</div>
			
			

			<div className='iniciar-sesion'>

				<div className='acceder-google'>
					<p>Iniciar Sesión</p>
					{/* <button><FcGoogle />Continuar con Google</button> */}
				</div>

				<form  method='POST' onSubmit={e => handleSubmit(e)}>

					
					<span id='error-email-user'>
						El correo ingresado no es valido
					</span>
					<span id='error-password-user'>
						La contraseña ingresada no es valida
					</span>
					
					<input 
					id='correo'
					type="email" 
					name='email' 
					placeholder='Correo Electrónico'
					onChange={e => setCorreo(e.target.value)}
					value={correo}
					autoComplete="off"
					/>
					
					<div className='formulario_password'>
						<input 
						id='password'
						type="password" 
						name='password' 
						placeholder='Contraseña' 
						onChange={e => setPassword(e.target.value)}
						value={password}
						onPaste={(e)=>{
							e.preventDefault()
							return false;
						  }} onCopy={(e)=>{
							e.preventDefault()
							return false;
						  }}
					/>
						{
						passwordType === true ? 
						( <BsEye onClick={mostrarContrasena} className='mostrarContraseña' /> )
						: 
						( <BsEyeSlash onClick={mostrarContrasena} className='mostrarContraseña' /> ) 	
						}
					</div>
					
					<button>Iniciar Sesion</button>
				</form>
				
				<div className='checkbox'>
					<p>
						<Link to='/recuperar-password' className='link'>
							¿Olvidaste tu contraseña?
						</Link>
					</p>
				</div>
				<div className='registrate'>
					<p>
						¿Aún no eres miembro?{' '}
						<Link to='/registrarse' className='link'>
							Registrarse
						</Link>
					</p>
				</div>
			</div>
		</section>
	)
}
