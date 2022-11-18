import { useParams } from 'react-router-dom'
import { NotFound } from './NotFound'
import { EmailVerify } from './EmailVerify.jsx'
import { PasswordVerify } from './PasswordVerify.jsx'

export function Verify() {
	const { code } = useParams()

	if (code.includes('verify')) {
		return <EmailVerify />
	}
	if (code.includes('recovery')) {
		return <PasswordVerify />
	}

	return <NotFound />
}
