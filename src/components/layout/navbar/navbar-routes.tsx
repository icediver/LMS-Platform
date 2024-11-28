'use client';

import { UserButton, useAuth } from '@clerk/clerk-react';
import { ClerkProvider } from '@clerk/nextjs';
import { Loader2, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

import { SearchInput } from '@/components/search-input';
import { Button } from '@/components/ui/shadcn/button';

import { isTeacher } from '@/lib/teacher';

export default function NavbarRoutes() {
	const { userId } = useAuth();
	const pathname = usePathname();

	const isTeacherPage = pathname?.startsWith('/teacher');
	const isCoursePage = pathname?.includes('/courses');
	const isSearchPage = pathname === '/search';

	return (
		<>
			{isSearchPage && (
				<Suspense
					fallback={
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
						</>
					}>
					<div className="hidden md:block">
						<SearchInput />
					</div>
				</Suspense>
			)}
			<div className="ml-auto flex gap-x-2">
				{isTeacherPage || isCoursePage ? (
					<Link href="/">
						<Button
							size="sm"
							variant="ghost">
							<LogOut className="mr2 size-4" />
							Exit
						</Button>
					</Link>
				) : isTeacher(userId) ? (
					<Link href="/teacher/courses">
						<Button
							size="sm"
							variant="ghost">
							Teacher mode
						</Button>
					</Link>
				) : null}
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
		</>
	);
}
