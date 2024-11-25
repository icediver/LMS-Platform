import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { CourseNavbar } from '@/components/layout/course/course-navbar';
import { CourseSidebar } from '@/components/layout/course/course-sidebar';

import { getProgress } from '@/actions/get-progress';
import { db } from '@/lib/db';

export default async function CourseIdLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ courseId: string }>;
}) {
	const { userId } = await auth();

	if (!userId) {
		return redirect('/');
	}

	const course = await db.course.findUnique({
		where: {
			id: (await params).courseId,
		},
		include: {
			chapters: {
				where: {
					isPublished: true,
				},
				include: {
					userProgress: {
						where: {
							userId,
						},
					},
				},
				orderBy: {
					position: 'asc',
				},
			},
		},
	});

	if (!course) {
		return redirect('/');
	}

	const progressCount = await getProgress(userId, course.id);

	return (
		<div className="h-full">
			<div className="fixed inset-y-0 z-50 h-[80px] w-full md:pl-80">
				<CourseNavbar
					course={course}
					progressCount={progressCount}
				/>
			</div>
			<div className="iset-y-0 fixed z-50 hidden h-full w-80 flex-col md:flex">
				<CourseSidebar
					course={course}
					progressCount={progressCount}
				/>
			</div>
			<main className="h-full pt-[80px] md:pl-80">{children}</main>
		</div>
	);
}
