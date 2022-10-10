import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react'
import logoContacto from '../assets/logoContacto.png';
import { BsEyeSlash } from 'react-icons/bs';
// import {FcGoogle} from 'react-icons/fc';

export function Acceder() {

	function mostrarContrasena(){
		let tipo = document.getElementById("password");
		if(tipo.type == "password"){
			tipo.type = "text";
		}else{
			tipo.type = "password";
		}
	}

	const [correo, setCorreo] = useState('');

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
			console.log("formulario enviado")
		} else {
			console.error('No es posible enviar el formulario')
			// alert('No es posible enviar el formulario')
		}
	}
	return (
		<section className='acceder'>

			<div className='logo'>
				<img src={logoContacto} alt="logo" />
			</div>

			<div className='iniciar-sesion'>
				<div className='acceder-google'>
					<p>Iniciar Sesión</p>
					{/* <button><FcGoogle />Continuar con Google</button> */}
				</div>
				<form  method='POST' onSubmit={e => handleSubmit(e)}>
					<label htmlFor="email">Ingresar Email</label>
					<span id='mensaje' className='mensaje'>
						El correo ingresado no es valido.
					</span>
					
					<input 
					id='correo'
					type="email" 
					name='email' 
					placeholder='Correo Electrónico'
					onChange={e => setCorreo(e.target.value)}
					value={correo}
					/>
					<label htmlFor="password">Ingresar Contraseña</label>
					<div className='formulario_password'>
						<input 
						id='password'
						type="password" 
						name='password' 
						placeholder='Contraseña' 
					/>
					<BsEyeSlash onClick={mostrarContrasena} className="mostrarContraseña"/>
					</div>
					
					
					<button>Iniciar Sesion</button>
				</form>
				<div className='checkbox'>
					<p><Link to='/recuperar-password' className='link'>¿Olvidaste tu contraseña?</Link></p>
				</div>
				<div className='registrate'>
					<p>¿Aún no eres miembro? <Link to='/registrarse' className='link'>Registrarse</Link></p>
				</div>
				
			</div>
		</section>
	)
}
