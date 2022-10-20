import { CgSpinnerTwoAlt } from 'react-icons/cg'

export function Loader() {
	return (
		<div className='loaderContainer'>
			<CgSpinnerTwoAlt size={60} className='loader' />
		</div>
	)
}
