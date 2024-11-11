'use client';

import { UserButton } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/shadcn/button';

export default function NavbarRoutes() {
	const pathname = usePathname();
	const router = useRouter();

	const isTeacherPage = pathname?.startsWith('/teacher');
	const isPlayerPage = pathname?.startsWith('/chapter');

	return (
		<div className="ml-auto flex gap-x-2">
			{isTeacherPage || isPlayerPage ? (
				<Link href="/">
					<Button
						size="sm"
						variant="ghost">
						<LogOut className="size-4 mr2" />
						Exit
					</Button>
				</Link>
			) : (
				<Link href="/teacher/courses">
					<Button
						size="sm"
						variant="ghost">
						Teacher mode
					</Button>
				</Link>
			)}
			<UserButton
				appearance={{
					elements: {
						userButtonPopoverFooter: 'hidden',
						userButtonPopoverCard: 'w-72',
						userButtonTrigger: 'size-9',
					},
				}}
			/>
		</div>
	);
}
