import { EmailVerify } from './EmailVerify.jsx'
import { PasswordVerify } from './PasswordVerify.jsx'

export function Verify() {
	if (!window.location.href.includes('verify')) {
		return <PasswordVerify />
	} else {
		return <EmailVerify />
	}
}
