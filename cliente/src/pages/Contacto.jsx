import { useState } from 'react'
import logoColor from '../assets/logoColor.png'

export function Contacto() {

	const [usuario, setUsuario] = useState({})

	const conseguirDatos = e => {
		e.preventDefault();

		let datos = e.target;
		let usuario = {
			nombre: datos.nombre.value,
			email: datos.email.value,
			asunto: datos.asunto.value,
			mensaje: datos.mensaje.value
		}

		console.log(usuario)
		setUsuario(usuario);
	}
	const cambiarDatos = e => {
		let name = e.target.name;
		let usuarioActualizado = usuario;

		setUsuario(estado_previo => ({ 
				...estado_previo,
				[name]: e.target.value
			
			})
			);
		}
		
		return (
		<section className="contacto">

				<div className='contenido'>
					<img src={logoColor} alt="Logo Say Quality" loading='lazy' />
					{/* <p>Para inscribirse a un curso en específico, completar el formulario con los datos solicitados y nos pondremos en contacto a la brevedad</p>	 */}
				</div>
			
			<form action="" method='POST' className='formulario' onSubmit={conseguirDatos}>
				<legend>Completa el formulario con tus datos</legend>
				<label htmlFor="nombre">Nombre</label>
				<input 
				type="text" 
				name='nombre' 
				placeholder=' Ingresa tu nombre' 
				onChange={cambiarDatos}
				/>

				<label htmlFor="Email">Email</label>
				<input 
				type="email" 
				name='email' 
				placeholder=' Ingresa tu email' 
				onChange={cambiarDatos}
				/>

				<label htmlFor="Asunto">Asunto</label>
				<input 
				type="text" 
				name='asunto' 
				placeholder=' Ingresa un asunto' 
				onChange={cambiarDatos}
				/>

				<label htmlFor="Mensaje">Mensaje</label>
				<textarea 
				name="mensaje" 
				placeholder=' Escribe tu mensaje'
				onChange={cambiarDatos}
				/>

				<button className='btn' value='enviar' name='enviar'>Enviar</button>

			</form>
		</section>
	)
}
