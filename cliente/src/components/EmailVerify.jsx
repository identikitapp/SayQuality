import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'

export function EmailVerify() {
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()

	useEffect(() => {
		const url = import.meta.env.VITE_URL_EMAIL_VERIFY

		const code = searchParams.get('code')

		const data = {
			code: code,
		}

		fetch(url, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		}).then(response => {
			if (!response.ok) {
				Swal.fire({
					icon: 'error',
					title: 'Ocurrio un error al verificar el email',
					confirmButtonColor: '#0083bb',
				})

				return setTimeout(() => {
					navigate('/')
				}, 3000)
			}

			Swal.fire({
				icon: 'success',
				title: 'Email verificado con exito',
				confirmButtonColor: '#0083bb',
			})

			return setTimeout(() => {
				navigate('/')
			}, 3000)
		})
	}, [])
}
