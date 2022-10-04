import { Link } from 'react-router-dom';
import logoContacto from '../assets/logoContacto.png';
import {FcGoogle} from 'react-icons/fc';

export function Acceder() {
	return (
		<section className='acceder'>

			<div className='logo'>
				<img src={logoContacto} alt="logo" />
			</div>

			<div className='iniciar-sesion'>
				<div className='acceder-google'>
					<p>Iniciar Sesión</p>
					<button><FcGoogle />Continuar con Google</button>
				</div>
				<form action="" method='POST'>
					<input type="email" name='email' placeholder='Correo Electrónico'/>
					<input type="password" name='password' placeholder='Contraseña' />
					<button>Iniciar Sesion</button>
				</form>
				<div className='checkbox'>
					<div className='recordame'>
						<input type="checkbox" name="checkbox" id="recordarme" />
						<p>Recordarme</p>
					</div>
					<p><strong><Link to='/recuperar-password' className='link'>¿Olvidaste tu contraseña?</Link></strong></p>
				</div>
				<div className='registrate'>
					<p>¿Aún no eres miembro? <Link to='/registrarse' className='link'>Registrarse</Link></p>
				</div>
				
			</div>
		</section>
	)
}
