import React from 'react'
import { Aside } from '../components/Aside';
import { Buttons} from '../components/Buttons';
import { InformacionPerfil } from '../components/InformacionPerfil';



export const Perfil = () => {
 
  return (
    <div className='contenedor_perfil'>
        <Aside />
        <section className='panel_informacion'>
            <Buttons />
            <InformacionPerfil />
        </section>
    </div>
  )
}
