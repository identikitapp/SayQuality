import React from 'react'
import { useState, useEffect } from 'react';
import { BsFillPlayFill } from 'react-icons/bs';
import { NavLink, useNavigate } from 'react-router-dom';
import createHeader from '../utils/createHeader'


export const Aside = () => {

  const [user, setUser] = useState();
  const navigate = useNavigate()

    const logout = () => {
      localStorage.removeItem('token')
      navigate("/acceder")

      location.reload()
    };

    useEffect(() => {

          const url = import.meta.env.VITE_URL_USER

          fetch(url, {
              method: 'GET',
              headers: createHeader(),
          })
              .then(response => {
                console.log(response)
        if (response.ok) {

         return response.json()
        } 
      })
              .then(data => setUser(data.data.user))

  }, [])

  return (
          <aside>
            <div className='imagen_perfil'>
                <p>Estudiante</p>
                {/* <img
								className='user-avatar-img'
								src={import.meta.env.VITE_URL_IMG + user.data.user.avatar}
								alt={user.data.user.username}
							></img> */}
            </div>
            <div className='secciones'>
                    <NavLink to="/perfil" className={({isActive}) => isActive ? "active" : ""}>
                      <BsFillPlayFill className='icon'/>Cursos</NavLink>

                    <NavLink to="/cuestionario" className={({isActive}) => isActive ? "active" : ""} >
                      <BsFillPlayFill className='icon'/>Cuestionarios</NavLink>

                    <NavLink to="/ajustes" className={({isActive}) => isActive ? "active" : ""}>
                      <BsFillPlayFill className='icon'/>Ajustes</NavLink>

                    <NavLink to="/acceder" className={({isActive}) => isActive ? "active" : ""} onClick={logout}>
                      <BsFillPlayFill className='icon'/>Cerrar Sesión</NavLink>
            </div>
        </aside>

  )
}
