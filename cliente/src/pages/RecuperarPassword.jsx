import React from 'react'
import logoContacto from '../assets/logoContacto.png';

export const RecuperarPassword = () => {
  return (
    <section className='acceder'>
                    <div className='logo'>
				        <img src={logoContacto} alt="logo" />
			        </div>
                <div className='iniciar-sesion'>
                    <form className='formulario_recuperar' action="" method='POST'>
                        <p className='instrucciones'>Por favor, introduce tu correo electrónico. Recibiras un mensaje de correo eletrónico con instrucciones sobre como restablecer tu contraseña</p>
                        <input className='correo' type="email" name='email' placeholder='Correo Electrónico'/>
                        <button className='recuperar'>Recuperar Contraseña</button>
                    </form>				
                </div>
    </section>
  )
}
