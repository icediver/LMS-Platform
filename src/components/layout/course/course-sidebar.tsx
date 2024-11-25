import { auth } from '@clerk/nextjs/server';
import { Chapter, Course, UserProgress } from '@prisma/client';
import { redirect } from 'next/navigation';

import { CourseSidebarItem } from './course-sidebar-item';
import { db } from '@/lib/db';

interface ICourseSidebar {
	course: Course & {
		chapters: (Chapter & { userProgress: UserProgress[] | null })[];
	};
	progressCount: number;
}
export async function CourseSidebar({ course, progressCount }: ICourseSidebar) {
	const { userId } = await auth();

	if (!userId) {
		redirect('/');
	}

	const purchase = await db.purchase.findUnique({
		where: {
			userId_courseId: {
				userId,
				courseId: course.id,
			},
		},
	});

	console.log('course', course, purchase);

	return (
		<div className="flex h-full flex-col overflow-y-auto border-r shadow-sm">
			<div className="flex flex-col border-b p-8">
				<h1 className="font-semibold">{course.title}</h1>
				{/*TODO: Check purchase and add progress*/}
			</div>
			<div className="flex w-full flex-col">
				{course.chapters.map((chapter) => (
					<CourseSidebarItem
						key={chapter.id}
						id={chapter.id}
						label={chapter.title}
						isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
						courseId={course.id}
						isLocked={!chapter.isFree && !purchase}
					/>
				))}
			</div>
		</div>
	);
}
