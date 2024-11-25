import { Chapter, Course, UserProgress } from '@prisma/client';

import NavbarRoutes from '../navbar/navbar-routes';

import { CourseMobileSidebar } from './course-mobile-sidebar';

interface ICourseNavbar {
	course: Course & {
		chapters: (Chapter & { userProgress: UserProgress[] | null })[];
	};
	progressCount: number;
}
export function CourseNavbar({ course, progressCount }: ICourseNavbar) {
	return (
		<div className="flex h-full items-center border-b bg-white p-4 shadow-sm">
			<CourseMobileSidebar
				course={course}
				progressCount={progressCount}
			/>
			<NavbarRoutes />
		</div>
	);
}
