import React from 'react'
import {FcGoogle} from 'react-icons/fc';
import logoContacto from '../assets/logoContacto.png';

export const Registrarse = () => {
  return (
    <section className='acceder'>
        	<div className='logo'>
				<img src={logoContacto} alt="logo" />
			</div>
        	<div className='iniciar-sesion'>
				<div className='acceder-google'>
					<p>Crea una cuenta</p>
					<button><FcGoogle />Continuar con Google</button>
				</div>
				<form action="" method='POST'>
                    <input type="email" name='email' placeholder='Nombre Completo'/>
					<input type="email" name='email' placeholder='Correo Electrónico'/>
					<input type="password" name='password' placeholder='Contraseña' />
					<input type="number" name='dni' placeholder='DNI' />
					<input type="number" name='phone' placeholder='Celular' />
					<button>Iniciar Sesion</button>
				</form>				
			</div>
    </section>
  )
}
