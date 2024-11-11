import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

import '@/assets/styles/globals.css';

import ToasterProvider from '@/providers/toaster-provider';

const geistSans = localFont({
	src: '../assets/fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});
const geistMono = localFont({
	src: '../assets/fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
	icons: [{ url: '/images/favicon.svg', href: '/images/favicon.svg' }],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
					<ToasterProvider />
					{children}
				</body>
			</html>
		</ClerkProvider>
	);
}
