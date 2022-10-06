import joaquin from '../assets/joaquinalcalde.jpg'
import matias from '../assets/matiasmagni.png'
import soledad from '../assets/soledadgarro.jpeg'
import { FaLinkedin, FaGithub } from 'react-icons/fa'
import { FiMail } from 'react-icons/fi'

export function Equipo() {
	return (
		<section className='equipo'>
			<article>
				<div>
					<img src={soledad} alt='Soledad Garro' />
					<h2>Soledad Garro</h2>
					<span>Profesora</span>
					<hr />
					<div className='redes'>
						<a
							href='https://www.linkedin.com/in/soledad-garro-68a80b199/'
							target='_blank'
						>
							<FaLinkedin size={20} className='linkedin' />
						</a>
						<a href='https://github.com/soledad-11' target='_blank'>
							<FaGithub size={20} />
						</a>
						<a href='mailto:soledad.garro@say-quality.com'>
							<FiMail size={20} className='github' />
						</a>
					</div>
				</div>
				<p>
					CEO de Say Quality. Analista QA con mas de 5 años de experiencia profesional en
					testing manual y automatizado.
				</p>
			</article>
			<article>
				<div>
					<img src={matias} alt='Matias Magni' />
					<h2>Joaquin Alcalde</h2>
					<span>Profesor</span>
					<hr />
					<div className='redes'>
						<a href='https://www.linkedin.com/in/matiasmagni/' target='_blank'>
							<FaLinkedin size={20} className='linkedin' />
						</a>
						<a href='https://github.com/matiasmagni' target='_blank'>
							<FaGithub size={20} />
						</a>
						<a href='mailto:matias.magni@say-quality.com'>
							<FiMail size={20} className='github' />
						</a>
					</div>
				</div>
				<p>
					Profesor con más de 5 años de experiencia en la enseñanza de contenidos TIC.
					Ingeniero Full Stack y de Automatización de Pruebas. Experiencia en desarrollo
					de software, diseño arquitectónico, solucionando problemas de software mediante
					la depuración de programas y la gestión de pipelines de CI/CD. Dominio de los
					lenguajes de programación JavaScript, Python, Java y C# utilizados para
					desarrollar aplicaciones web o frameworks de automatización de pruebas.
				</p>
			</article>
			<article>
				<div>
					<img src={joaquin} alt='Joaquin Alcalde' />
					<h2>Joaquin Alcalde</h2>
					<span>Profesor</span>
					<hr />
					<div className='redes'>
						<a
							href='https://www.linkedin.com/in/joaquin-alcalde-busca-trabajo/'
							target='_blank'
						>
							<FaLinkedin size={20} className='linkedin' />
						</a>
						<a href='mailto:joaquin.alcalde@say-quality.com'>
							<FiMail size={20} className='github' />
						</a>
					</div>
				</div>
				<p>
					Comunicador social orientado al mundo digital, con mas de 5 años de experiencia
					en la docencia. Conocimientos de FullStack, QA, UX y metodologías ágiles.
				</p>
			</article>
		</section>
	)
}
