import { Chapter, Course, UserProgress } from '@prisma/client';
import { Menu } from 'lucide-react';

import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/shadcn/sheet';

import { CourseSidebar } from './course-sidebar';

interface ICourseMobileSidebar {
	course: Course & {
		chapters: (Chapter & { userProgress: UserProgress[] | null })[];
	};
	progressCount: number;
}
export function CourseMobileSidebar({
	course,
	progressCount,
}: ICourseMobileSidebar) {
	return (
		<Sheet>
			<SheetTrigger className="pr-4 hover:opacity-75 md:hidden">
				<Menu />
			</SheetTrigger>
			<SheetContent
				side="left"
				className="w-72 bg-white p-0">
				<SheetTitle className="hidden">Course</SheetTitle>
				<CourseSidebar
					course={course}
					progressCount={progressCount}
				/>
			</SheetContent>
		</Sheet>
	);
}
