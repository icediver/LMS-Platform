import { Category, Chapter, Course } from '@prisma/client';

import { getProgress } from './get-progress';
import { db } from '@/lib/db';

type CourseWithProgressWithCategory = Course & {
	category: Category;
	chapters: Chapter[];
	progress: number | null;
};

type DashboardCoursesType = {
	completedCourses: CourseWithProgressWithCategory[];
	coursesInProgress: CourseWithProgressWithCategory[];
};

export async function getDashboardCourses(
	userId: string
): Promise<DashboardCoursesType> {
	try {
		const purchasedCourses = await db.purchase.findMany({
			where: {
				userId: userId,
			},
			select: {
				course: {
					include: {
						category: true,
						chapters: {
							where: {
								isPublished: true,
							},
						},
					},
				},
			},
		});
		const courses = purchasedCourses.map(
			(purchase) => purchase.course
		) as CourseWithProgressWithCategory[];

		for (const course of courses) {
			const progress = await getProgress(userId, course.id);
			course['progress'] = progress;
		}

		const competedCourses = courses.filter((course) => course.progress === 100);
		const coursesInProgress = courses.filter(
			(course) => (course.progress ?? 0) < 100
		);

		return {
			completedCourses: competedCourses,
			coursesInProgress: coursesInProgress,
		};
	} catch (error) {
		console.log('[GET_DASHBOARD_COURSES]', error);
		return {
			completedCourses: [],
			coursesInProgress: [],
		};
	}
}
