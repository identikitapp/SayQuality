import React from 'react'
import { Aside } from '../components/Aside'
import { InformacionPerfil } from '../components/InformacionPerfil'

export const CuestionarioPerfil = () => {
  return (
    <div className='contenedor_perfil'>
    <Aside />
 <section className='panel_informacion'>
    <InformacionPerfil />
    <p>No hay Cuestionarios disponibles!</p>
 </section>
</div>
  )
}
