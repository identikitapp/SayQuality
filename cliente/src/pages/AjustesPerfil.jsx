import React from 'react'
import { Ajustes} from '../components/Ajustes'
import { Aside} from '../components/Aside'
export const AjustesPerfil = () => {
  return (
    <div className='contenedor_perfil'>
            <Aside />
    <section className='panel_informacion_ajustes'>
           <Ajustes />
    </section>
    </div>
  )
}
