import Image from 'next/image';

export function Logo() {
	return (
		<Image
			height={130}
			width={130}
			alt="logo"
			src="/images/logo.svg"
		/>
	);
}
