import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Home } from '../pages/Home'
import { Cursos } from '../pages/Cursos'
import { Equipo } from '../pages/Equipo'
import { Contacto } from '../pages/Contacto'
import { Acceder } from '../pages/Acceder'
import { Footer } from './Footer'
import { Registrarse } from '../pages/Registrarse'
import { Verify } from './Verify'
import { RecuperarPassword } from '../pages/RecuperarPassword'
// import { CuestionarioPerfil } from '../pages/CuestionarioPerfil'
import { AjustesPerfil } from '../pages/AjustesPerfil'
import { CourseDetails } from '../pages/CourseDetails'
import { Perfil } from '../pages/Perfil'

export function App() {
	return (
		<BrowserRouter>
			<header className='header'>
				<Navbar />
			</header>
			<main>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/cursos' element={<Cursos />} />
					<Route path='/equipo' element={<Equipo />} />
					<Route path='/contacto' element={<Contacto />} />
					<Route path='/acceder' element={<Acceder />} />
					<Route path='/registrarse' element={<Registrarse />} />
					<Route path='/recuperar-password' element={<RecuperarPassword />} />
					<Route path='/cursos/:name' element={<CourseDetails />} />
					<Route path='/perfil' element={<Perfil />} />
					<Route path='/:code' element={<Verify />} />
					<Route path='/ajustes' element={<AjustesPerfil />} />

					<Route path='*' element={<Navigate replace to='/' />} />
				</Routes>
			</main>
			<footer>
				<Footer />
			</footer>
		</BrowserRouter>
	)
}
