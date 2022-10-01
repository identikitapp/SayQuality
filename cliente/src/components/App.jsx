import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Home } from '../pages/Home'
import { Cursos } from '../pages/Cursos'
import { Equipo } from '../pages/Equipo'
import { Contacto } from '../pages/Contacto'
import { Acceder } from '../pages/Acceder'
import { Footer } from './Footer'

export function App() {
	return (
		<BrowserRouter>
			<header>
				<Navbar />
			</header>
			<main>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/cursos' element={<Cursos />} />
					<Route path='/equipo' element={<Equipo />} />
					<Route path='/contacto' element={<Contacto />} />
					<Route path='/acceder' element={<Acceder />} />
					<Route path='*' element={<Navigate replace to='/' />} />
				</Routes>
			</main>
			<footer>
				<Footer />
			</footer>
		</BrowserRouter>
	)
}
