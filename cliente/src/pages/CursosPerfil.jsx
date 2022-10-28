import React from 'react'
import { Aside } from '../components/Aside';
import { InformacionCursos } from '../components/InformacionCursos';
export const CursosPerfil = () => {
  return (
    <div className='contenedor_perfil'>
       <Aside />
    <section className='panel_informacion'>
        <InformacionCursos/>
    </section>
    </div>
  )
}
