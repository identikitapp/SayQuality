import { Link } from 'react-router-dom';
import logoContacto from '../assets/logoContacto.png'

export function Acceder() {
	return (
		<section className='acceder'>

			<div className='logo'>
				<img src={logoContacto} alt="logo" />
			</div>

			<div className='iniciar-sesion'>
				<div className='acceder-google'>
					<p>Iniciar Sesión</p>
					<button>Continuar con Google</button>
				</div>
				<form action="" method='POST'>
					<input type="email" name='email' placeholder='Correo Electrónico'/>
					<input type="password" name='password' placeholder='Contraseña' />
				</form>
				<div className='checkbox'>
					<input type="checkbox" name="checkbox" id="recordarme" />
					<p><strong>¿Olvidaste tu contraseña?</strong></p>
				</div>
				<p>¿Aún no eres miembro? <strong>Regístrate</strong></p>
			</div>
		</section>
	)
}
