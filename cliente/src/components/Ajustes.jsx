import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import Swal from 'sweetalert2'
import createHeader from '../utils/createHeader'

export const Ajustes = () => {
	const [nombre, setNombre] = useState('')
	const [correo, setCorreo] = useState('')

	const [linkedin, setLinkedin] = useState('')
	const [facebook, setFacebook] = useState('')
	const [twitter, setTwitter] = useState('')
	const [github, setGithub] = useState('')
	const [youtube, setYoutube] = useState('')

	const [password, setPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [biography, setBiography] = useState('')
	const [avatar, setAvatar] = useState('')

	const [error, setError] = useState(null)
	const [error1, setError1] = useState(null)

	// const [user, setUser] = useState(null)
	const [selectedFile, setSelectedFile] = useState()

	const peticion = useCallback(() => {
		const url = import.meta.env.VITE_URL_USER

		fetch(url, {
			method: 'GET',
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
				let me = result.data.user

				document.getElementById('nombre').value = me.username
				document.getElementById('email').value = me.email
				document.getElementById('facebook').value = me.facebook
				document.getElementById('linkedin').value = me.linkedin
				document.getElementById('youtube').value = me.youtube
				document.getElementById('twitter').value = me.twitter
				document.getElementById('github').value = me.github
				document.getElementById('biography').value = me.biography
			})
	})

	useEffect(() => {
		peticion()
	}, [])

	function getImg(e) {
		const urlImg = import.meta.env.VITE_URL_IMG
		let token = window.localStorage.getItem('token')
		const reader = new FileReader()
		reader.readAsDataURL(e)

		reader.addEventListener('error', () => {
			console.error(`Error occurred reading file: ${selectedFile.name}`)
		})

		reader.addEventListener('load', evt => {
			fetch(urlImg, {
				method: 'POST',
				body: reader.result,
				headers: {
					'Content-Type': 'image/png',
					Authorization: 'Bearer ' + token,
				},
			})
				.then(response => response.json())
				.then(result => {
					if (!result.data) {
						return Swal.fire({
							icon: 'error',
							title: 'error',
							confirmButtonColor: '#0083bb',
						})
					}
					setAvatar(result.data.name)
				})
		})
	}

	const enviarFormulario = async () => {
		const data = {
			username: nombre.trim(),
			password: password.trim(), //LA CONTRASEÑA ACTUAL (OBLIGATORIA)
			email: correo.trim(),
			newPassword: newPassword.trim(),
			biography: biography.trim(),
			linkedin: linkedin.trim(),
			facebook: facebook.trim(),
			twitter: twitter.trim(),
			github: github.trim(),
			youtube: youtube.trim(),
			avatar: avatar,
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
				return Swal.fire({
					icon: 'success',
					title: 'Tus cambios se han guardado con exito',
					confirmButtonColor: '#0083bb',
				})
			})
		location.reload()
	}

	const handleChangeLinkedin = e => {
		setLinkedin(e.target.value)
	}
	const handleChangeFacebook = e => {
		setFacebook(e.target.value)
	}
	const handleChangeTwitter = e => {
		setTwitter(e.target.value)
	}
	const handleChangeGithub = e => {
		setGithub(e.target.value)
	}
	const handleChangeYoutube = e => {
		setYoutube(e.target.value)
	}
	const handleChangePassword = e => {
		setPassword(e.target.value)
	}
	const handleChangeNewPassword = e => {
		setNewPassword(e.target.value)
	}
	const handleChangeBiography = e => {
		setBiography(e.target.value)
	}

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

	function handleSubmit(e) {
		e.preventDefault()
		enviarFormulario()
	}

	return (
		<>
			<form onSubmit={e => handleSubmit(e)} autoComplete='off'>
				<div className='formulario_ajustes'>
					{/* Formulario Informacion Personal */}

					<div className='inputs'>
						<label htmlFor='Nombre'>Nombre</label>
						<input
							id='nombre'
							type='text'
							placeholder='Nombre'
							name='name'
							onChange={handleChangeNombre}
						/>
						{error1 && <h2 className='error'>{error1}</h2>}
					</div>

					<div className='inputs'>
						<label htmlFor='Correo Electronico'>Correo Electronico</label>
						<input
							type='email'
							placeholder='Correo Electronico'
							id='email'
							name='email'
							onChange={handleChangeEmail}
						/>
						{error && <h2 className='error'>{error}</h2>}
					</div>

					{/* Formulario Redes Sociales */}

					<div className='inputs'>
						<label htmlFor='facebook'>Facebook</label>
						<input
							className='facebook'
							type='text'
							name='facebook'
							placeholder='Facebook'
							id='facebook'
							onChange={handleChangeFacebook}
						/>
						<span>facebook.com/</span>
					</div>

					<div className='inputs'>
						<label htmlFor='Linkedin'>Linkedin</label>
						<input
							className='linkedin'
							type='text'
							name='linkedin'
							placeholder='Linkedin'
							id='linkedin'
							onChange={handleChangeLinkedin}
						/>
						<span>linkedin.com/</span>
					</div>

					<div className='inputs'>
						<label htmlFor='twitter'>Twitter</label>
						<input
							className='twitter'
							type='text'
							name='twitter'
							placeholder='twiter'
							id='twitter'
							onChange={handleChangeTwitter}
						/>
						<span>twitter.com/</span>
					</div>

					<div className='inputs'>
						<label htmlFor='twitter'>Github</label>
						<input
							className='twitter'
							type='text'
							name='github'
							placeholder='Github'
							id='github'
							onChange={handleChangeGithub}
						/>
						<span>github.com/</span>
					</div>

					<div className='inputs'>
						<label htmlFor='youtube'>Youtube</label>
						<input
							className='youtube'
							type='text'
							name='youtube'
							placeholder='Youtube'
							id='youtube'
							onChange={handleChangeYoutube}
						/>
						<span>youtube.com/@</span>
					</div>
				</div>

				<div className='info'>
					<div className='informacion_biografica'>
						<label htmlFor='Informacion'>Descripcion</label>
						<textarea
							type='text'
							name='biography'
							id='biography'
							onChange={handleChangeBiography}
						/>
					</div>

					<div className='avatar'>
						<p>Agregar avatar</p>
						<input
							type='file'
							id='file'
							name='file'
							onChange={e => {
								getImg(e.target.files[0])
								selectedFile
							}}
							accept='image/*'
						/>
					</div>
					<div className='contenedor_contraseñas'>
						<div className='cambiar_contraseña'>
							<label>
								<p className='campo'>*Campo Requerido</p>Contraseña Actual
							</label>

							<input
								type='text'
								placeholder='Contraseña actual'
								id='password'
								onChange={handleChangePassword}
								required
							/>
						</div>
						<div className='cambiar_contraseña contraseña-nueva'>
							<label>Contraseña Nueva</label>
							<input
								type='text'
								placeholder='Contraseña Nueva'
								id='newPassword'
								onChange={handleChangeNewPassword}
							/>
						</div>
					</div>

					<div className='btn'>
						<button className='btn-guardar' type='submit'>
							Guardar Cambios
						</button>
					</div>
				</div>
			</form>
		</>
	)
}
