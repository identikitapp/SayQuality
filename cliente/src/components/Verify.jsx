import { EmailVerify } from './EmailVerify.jsx'
import { PasswordVerify } from './PasswordVerify.jsx'

export function Verify() {
	console.log(window.location.href)

	if (!window.location.href.includes('verify')) {
		return <PasswordVerify />
	} else {
		return <EmailVerify />
	}
}
