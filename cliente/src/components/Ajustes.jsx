import React from 'react'
import { BiImageAdd } from 'react-icons/bi';
export const Ajustes = () => {
  return (
    <>
           
        <form action="" className='formulario_ajustes'>
            <div className='inputs'>
              <label htmlFor="Nombre">Nombre</label>
              <input type="text" placeholder='Nombre' name='name' />
            </div>
           
            <div className='inputs'>
              <label htmlFor="apellido">Apellido</label>
              <input type="text" placeholder='Apellido' name='lastName' />
            </div>
           
            <div className='inputs'>
              <label htmlFor="Correo Electronico">Correo Electronico</label>
              <input type="email" placeholder='Correo Electronico'  />
            </div>
            
            <div className='inputs'>
              <label htmlFor="facebook">Facebook</label>
              <input type="text" placeholder='Facebook'  />
            </div>
           
            <div className='inputs'>
              <label htmlFor="Linkedin">Linkedin</label>
              <input type="text" placeholder='Linkedin'  />
            </div>
          
            <div className='inputs'>
              <label htmlFor="twitter">Twitter</label>
              <input type="text" placeholder='Celular'  />
            </div>
            
            <div className='inputs'>
              <label htmlFor="twitter">Youtube</label>
              <input type="text" placeholder='Youtube'  />
            </div>
            
        </form>

            <div className='informacion_biografica'> 
                <label htmlFor="Informacion">Informacion Biográfica</label>
                <textarea></textarea>
            </div>

            <div className='avatar'>
              <p className='avatar_icon'>Avatar<BiImageAdd/></p>
              <p>Mostrar Foto de perfil</p>
              <button>Guardar</button>
            </div>

            <div className='cambiar_contraseña'>
              <label htmlFor="cambiarContraseña">Cambiar Contraseña</label>
              <input type="text" placeholder='Cambiar Contraseña'  /> 
              <button>Guardar</button>
            </div>
      
            
    </>
  )
}
