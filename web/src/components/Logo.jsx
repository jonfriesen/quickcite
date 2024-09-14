import Image from 'next/image'
import logo from '../images/logo.svg'

export function Logo(props) {
	return <Image width={56} src={logo} alt="QuickCite" {...props} />
}
