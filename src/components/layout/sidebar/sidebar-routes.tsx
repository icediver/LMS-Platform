'use client';

import { BarChart, Compass, Layout, List } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { SidebarItem } from './sidebar-item';

const guestRoutes = [
	{
		icon: Layout,
		label: 'Dashboard',
		href: '/',
	},
	{
		icon: Compass,
		label: 'Browse',
		href: '/search',
	},
];

const teacherRoutes = [
	{
		icon: List,
		label: 'Courses',
		href: '/teacher/courses',
	},
	{
		icon: BarChart,
		label: 'Analytics',
		href: '/teacher/analytics',
	},
];

export function SidebarRoutes() {
	const pathname = usePathname();

	const isTeacher = pathname?.includes('/teacher');

	const routes = isTeacher ? teacherRoutes : guestRoutes;

	return (
		<div className="flex w-full flex-col">
			{routes.map((route) => (
				<SidebarItem
					key={route.href}
					icon={route.icon}
					label={route.label}
					href={route.href}
				/>
			))}
		</div>
	);
}
