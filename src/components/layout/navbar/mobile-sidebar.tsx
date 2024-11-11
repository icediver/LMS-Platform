import { Menu } from 'lucide-react';

import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/shadcn/sheet';

import { Sidebar } from '../sidebar/sidebar';

export function MobileSidebar() {
	return (
		<Sheet>
			<SheetTrigger className="hover-opacity-75 pr-4 transition md:hidden">
				<Menu />
			</SheetTrigger>
			<SheetContent
				side="left"
				className="bg-white p-0">
				<SheetTitle className="hidden">Menu</SheetTitle>
				<Sidebar />
			</SheetContent>
		</Sheet>
	);
}
