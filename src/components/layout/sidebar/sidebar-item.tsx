'use client';

import { LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

interface ISidebarItem {
	label: string;
	href: string;
	icon: LucideIcon;
}

export function SidebarItem({ label, href, icon: Icon }: ISidebarItem) {
	const pathname = usePathname();
	const router = useRouter();

	const isActive =
		(pathname === '/' && href === '/') ||
		pathname === href ||
		pathname.startsWith(`${href}/`);
	function onClick() {
		router.push(href);
	}
	return (
		<button
			className={cn(
				'flex items-center gap-x-2 pl-6 font-[500] text-slate-500 transition-all hover:bg-slate-300/20 hover:text-slate-600',
				isActive &&
					'bg-sky-200/20 text-sky-700 hover:bg-sky-200/20 hover:text-sky-700'
			)}
			onClick={onClick}
			type="button">
			<div className="flex items-center gap-x-2 py-4">
				<Icon
					size={22}
					className={cn('text-slate-500', isActive && 'text-sky-700')}
				/>
				<span className="text-sm font-medium">{label}</span>
			</div>
			<div
				className={cn(
					'ml-auto h-full border-2 border-sky-700 opacity-0 transition-all',
					isActive && 'opacity-100'
				)}
			/>
		</button>
	);
}
