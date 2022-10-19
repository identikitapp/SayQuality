import { Link } from 'react-router-dom'
import { IoIosRocket } from 'react-icons/io'

export function Home() {
	return (
		<section className='home'>
			<article>
				<h1>
					Convertite en Tester profesional o dale un impulso a tu carrera con nuestros
					cursos! <IoIosRocket size={40} className='rocketIcon' />
				</h1>
				<h2>
					Comenza a invertir en tu educacion con nosotros, cursos desde cero totalmente
					gratis y 100% online.
				</h2>
				<Link to='/cursos'>Ver todos los cursos</Link>
			</article>
			<article>
				<h2>¿Por que Say Quality?</h2>
				<div className='cardsContainer'>
					<div className='divisor'>
						<div className='card'>
							<h3>Aprendé junto a tus compañeros</h3>
							<span>
								Está demostrado que aprender en grupo es más eficiente y motivador. El
								networking con tus compañeros de clase ayuda a que puedas tener nuevas
								ideas y hacer mejores proyectos.
							</span>
						</div>
						<div className='card'>
							<h3>Acceso a contenido actualizado</h3>
							<span>
								Una vez que finalices el curso, para que puedas seguir aprendiendo e
								informándote del mundo digital, dispones los recursos de clase
								actualizados que puedes acceder de por vida.
							</span>
						</div>
						<div className='card'>
							<h3>Experiencia de aprendizaje</h3>
							<span>
								Enfréntate a situaciones de trabajo reales. A través de la práctica, irás
								superando desafíos y obteniendo nuevas habilidades.
							</span>
						</div>
					</div>
					<div className='divisor'>
						<div className='card'>
							<h3>100% online</h3>
							<span>
								Todas nuestras carreras son a remoto. Solo necesitas una computadora y
								acceso a internet.
							</span>
						</div>
						<div className='card'>
							<h3>Soporte 1:1</h3>
							<span>
								En cada curso te van a acompañar tutores que van a resolver tus dudas y a
								darte feedback sobre tus proyectos siempre que lo necesites.
							</span>
						</div>
						<div className='card'>
							<h3>Acceso 24/7</h3>
							<span>
								Aprende a la hora que quieras desde donde tú elijas. ¡Sin horarios!
							</span>
						</div>
					</div>
				</div>
			</article>
			<article>
				<h2>No postergues más tu educación, ¡tu futuro te está esperando!</h2>
				<span>
					Un nuevo empleo, mejor salario, mayor calidad de vida, ¡todo lo puedes conseguir
					con educación! Es el momento de lograr lo que siempre has querido.
				</span>
				<Link to='/registrarse'>Comenza a estudiar gratis</Link>
			</article>
		</section>
	)
}
