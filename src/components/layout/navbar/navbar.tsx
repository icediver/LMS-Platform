import dynamic from 'next/dynamic';

import { MobileSidebar } from './mobile-sidebar';
import NavbarRoutes from './navbar-routes';

const DynamicNavbarRoutes = dynamic(() => import('./navbar-routes'), {
	ssr: false,
});

export function Navbar() {
	return (
		<nav className="flex h-full items-center border-b bg-white p-4 shadow-sm">
			<MobileSidebar />
			<DynamicNavbarRoutes />
		</nav>
	);
}
