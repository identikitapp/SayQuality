import React from 'react'
import { useState, useEffect, useCallback } from 'react'
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
	const [biography, setBiography] = useState('')

	const [error, setError] = useState(null)
	const [error1, setError1] = useState(null)
	const [error2, setError2] = useState(null)

	const [user, setUser] = useState(null)

	const peticion = useCallback (() => {
		const url = import.meta.env.VITE_URL_USER
		
		fetch(url, {
			method: 'GET',
			headers: createHeader(),
		})
			.then(response => response.json())
			.then(result => {
				console.log(result)
				if (!result.data) {
					return Swal.fire({
						icon: 'error',
						title: result.error.message,
						confirmButtonColor: '#0083bb',
					})
				}

				return setUser(result.data.user)
			})
			
	})
		
	useEffect(() => {
		peticion()
	}, [])
	function getImg(e) {
		const urlImg = import.meta.env.VITE_URL_IMG;
		let token = window.localStorage.getItem('token');
		const reader = new FileReader();
		reader.readAsDataURL(e);
	
		reader.addEventListener('error', () => {
			console.error(`Error occurred reading file: ${selectedFile.name}`);
		});
	
		reader.addEventListener('load', (evt) => {
			fetch(urlImg, {
				method: 'POST',
				body: reader.result,
				headers: {
					'Content-Type': 'image/png',
					'Authorization': 'Bearer ' + token
				}
			})
				.then(response => response.json())
				.then(result => {
					if (!result.data) {
						console.log(result.error);
						return Swal.fire({
							icon: 'error',
							title: "error",
							confirmButtonColor: '#0083bb',
						});
					};
					setAvatar(result.data.name);
					console.log(result.data.name);
	
				})
		});
	};

	const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])
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
					console.log(result.error)
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
	const handleChangePassword = e => {
		setPassword(e.target.value)
	}
	const handleChangeNewPassword = e => {
		setNewPassword(e.target.files[0])
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

	function handleSubmit(e) {
		e.preventDefault()
		enviarFormulario()
	}

	return (
		
		<>	
		
		<div>
				{			
			
				user !== null ? (
					<div>
						<p>{}</p>
					</div>
					
				) :
				
				(
					<p>usuario no encontrado</p>
				)
						
				}
		
		</div>
			
				

			<form onSubmit={e => handleSubmit(e)} autoComplete='off'>
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
							type='text'
							name='biography'
							value={biography}
							onChange={handleChangeBiography}
						/>
					</div>

					<div className='avatar'>
						{selectedFile && <img src={preview} />}
						<p>Agregar avatar</p>
						<input
							type='file'
							id='file'
							name='file'
							onChange={e => {
								getImg(e.target.files[0])
								onSelectFile
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
								value={password}
								onChange={handleChangePassword}
								required
							/>
						</div>
						<div className='cambiar_contraseña contraseña-nueva'>
							<label>Contraseña Nueva</label>
							<input
								type='text'
								placeholder='Contraseña Nueva'
								value={newPassword}
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
