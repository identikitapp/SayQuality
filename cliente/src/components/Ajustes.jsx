import React from 'react'
import { BiImageAdd } from 'react-icons/bi'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import createHeader from '../utils/createHeader'

export const Ajustes = () => {
	
	const [nombre, setNombre] = useState('')
	const [apellido, setApellido] = useState('')
	const [correo, setCorreo] = useState('')

	const [linkedin, setLinkedin] = useState('')
	const [facebook, setFacebook] = useState('')
	const [twitter, setTwitter] = useState('')
	const [github, setGithub] = useState('')

	const [password, setPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [avatar, setAvatar] = useState('')
	const [biography, setBiography] = useState('')

	const [error, setError] = useState(null)
	const [error1, setError1] = useState(null)
	const [error2, setError2] = useState(null)



	const enviarFormulario = async () => {

		const data = {
			username: nombre.trim(),
			password: password.trim(), //LA CONTRASEÑA ACTUAL (OBLIGATORIA)
			email: correo.trim(),
			newPassword: newPassword.trim(),
			biography: biography.trim(),
			avatar: avatar.trim(),
			linkedin: linkedin.trim(),
			facebook: facebook.trim(),
			twitter: twitter.trim(),
			github: github.trim()
		}

		const url = import.meta.env.VITE_URL_USER

		await fetch(url, {
			method: 'PATCH',
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
			})
	}

	const handleChangeLinkedin = (e) => {setLinkedin(e.target.value)}
	const handleChangeFacebook = (e) => {setFacebook(e.target.value)}
	const handleChangeTwitter = (e) => {setTwitter(e.target.value)}
	const handleChangeGithub = (e) => {setGithub(e.target.value)}
	const handleChangePassword = (e) => {setPassword(e.target.value)}
	const handleChangeNewPassword = (e) => {setNewPassword(e.target.value)}
	const handleChangeAvatar = (e) => {setAvatar(e.target.value)}
	const handleChangeBiography = (e) => {setBiography(e.target.value)}

	// Validar Nombre
	function validarNombre(nombre) {
		return /^[A-Za-z\ ]{3,20}$/.test(nombre)
	}

	const handleChangeNombre = e => {
		if (!validarNombre(e.target.value)) {
			setError1('Nombre Invalido')
		} else {
			setError1(null)
		}
		setNombre(e.target.value)
	}

	useEffect(() => {
		validarNombre()
	}, [nombre])

	// ==========================

	// Validar Apellido

	function validarApellido(apellido) {
		return /^[A-Za-z\ ]{3,20}$/.test(apellido)
	}

	const handleChangeApellido = e => {
		if (!validarApellido(e.target.value)) {
			setError2('Apellido Invalido')
		} else {
			setError2(null)
		}
		setApellido(e.target.value)
	}

	useEffect(() => {
		validarApellido()
	}, [apellido])

	// ===============================

	// Validar Email
	function validarCorreo(email) {
		return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
			email
		)
	}

	const handleChangeEmail = e => {
		if (!validarCorreo(e.target.value)) {
			setError('email invalido')
		} else {
			setError(null)
		}

		setCorreo(e.target.value)
	}

	useEffect(() => {
		validarCorreo()
	}, [correo])
	// ==============================

	// function validarFormulario() {
	// 	if (validarCorreo() && validarNombre() && validarApellido()) return true
	// }

	function handleSubmit(e) {
		e.preventDefault()

		// if (!validarFormulario()) {
		// 	return Swal.fire({
		// 		icon: 'error',
		// 		title: 'Por favor, complete el formulario correctamente',
		// 		confirmButtonColor: '#0083bb',
		// 	})
		// }

		enviarFormulario()
	}

	return (
		<>
		<form onSubmit={e => handleSubmit(e)}>
			<div className='formulario_ajustes'>
				{/* Formulario Informacion Personal */}
				
					<div className='inputs'>
						<label htmlFor='Nombre'>Nombre</label>
						<input
							type='text'
							placeholder='Nombre'
							name='name'
							value={nombre}
							onChange={handleChangeNombre}
						/>
						{error1 && <h2 className='error'>{error1}</h2>}
					</div>

					<div className='inputs'>
						<label htmlFor='apellido'>Apellido</label>
						<input
							type='text'
							placeholder='Apellido'
							name='lastName'
							value={apellido}
							onChange={handleChangeApellido}
						/>
						{error2 && <h2 className='error'>{error2}</h2>}
					</div>

					<div className='inputs'>
						<label htmlFor='Correo Electronico'>Correo Electronico</label>
						<input
							type='email'
							placeholder='Correo Electronico'
							id='message'
							name='email'
							value={correo}
							onChange={handleChangeEmail}
						/>
						{error && <h2 className='error'>{error}</h2>}
					</div>
						

				{/* Formulario Redes Sociales */}
				
					<div className='inputs'>
						<label htmlFor='facebook'>Facebook</label>
						<input 
						type='text'
						name='facebook' 
						placeholder='Facebook' 
						value={facebook}
						onChange={handleChangeFacebook}
						/>
					</div>

					<div className='inputs'>
						<label htmlFor='Linkedin'>Linkedin</label>
						<input 
						type='text'
						name='linkedin' 
						placeholder='Linkedin' 
						value={linkedin}
						onChange={handleChangeLinkedin}
						/>
					</div>

					<div className='inputs'>
						<label htmlFor='twitter'>Twitter</label>
						<input 
						type='text' 
						name='twitter'
						placeholder='twiter' 
						value={twitter}
						onChange={handleChangeTwitter}
						/>
					</div>

					<div className='inputs'>
						<label htmlFor='twitter'>Github</label>
						<input 
						type='text' 
						name='github'
						placeholder='Github' 
						value={github} 
						onChange={handleChangeGithub}
						/>
					</div>
				
			</div>


			<div className='info'>

				
				<div className='informacion_biografica'>
					<label htmlFor='Informacion'>Informacion Biográfica</label>
					<textarea 
					type="text"
					name='biography' 
					value={biography} 
					onChange={handleChangeBiography}
					/>
				</div>

				<div className='avatar'>
					<p className='avatar_icon'>
						Avatar
						<input
						type="file"
						value={avatar}
						onChange={(e) => setAvatar(e.target.files[0])}
						/>
						<BiImageAdd/>
					</p>
					<p>Mostrar Foto de perfil</p>
				</div>

				<div className='cambiar_contraseña'>
					<label>Contraseña Actual</label>
					<input type='text' 
					placeholder='Contraseña actual' 
					value={password}
					onChange={handleChangePassword}
					/>
				</div>
				<div className='cambiar_contraseña'>
					<label>Cambiar contraseña</label>
					<input type='text' 
					placeholder='Cambiar Contraseña' 
					value={newPassword}
					onChange={handleChangeNewPassword}
					/>
				</div>
				<div className='btn'>
					<button className='btn-guardar' type='submit'>Guardar Cambios</button>
				</div>
			</div>
		</form>
		</>
	)
}
