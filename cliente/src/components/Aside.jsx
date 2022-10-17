import React from 'react'
import { BiImageAdd } from 'react-icons/bi';
import { BsFillPlayFill } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import { CursosPerfil } from '../pages/CursosPerfil';
export const Aside = () => {
  return (
          <aside>
            <div className='imagen_perfil'>
                <p>Estudiante</p>
                <div className='circulo'><BiImageAdd className='icon-add'/></div>
            </div>
            <div className='secciones'>
                    <NavLink className='enlaces_secciones' to={ <CursosPerfil />}><BsFillPlayFill className='icon'/>Cursos</NavLink>
                    <NavLink className='enlaces_secciones'><BsFillPlayFill className='icon'/>Cuestionarios</NavLink>
                    <NavLink className='enlaces_secciones'><BsFillPlayFill className='icon'/>Pedidos</NavLink>
                    <NavLink className='enlaces_secciones'><BsFillPlayFill className='icon'/>Ajustes</NavLink>
                    <NavLink className='enlaces_secciones'><BsFillPlayFill className='icon'/>Cerrar Sesión</NavLink>
            </div>
        </aside>

  )
}
