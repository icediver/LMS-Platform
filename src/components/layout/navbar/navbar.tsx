import { MobileSidebar } from './mobile-sidebar';
import NavbarRoutes from './navbar-routes';

export function Navbar() {
	return (
		<nav className="flex h-full items-center border-b bg-white p-4 shadow-sm">
			<MobileSidebar />
			<NavbarRoutes />
		</nav>
	);
}
