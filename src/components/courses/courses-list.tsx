import { Category, Course } from '@prisma/client';

import { CourseCard } from './course-card';

type CourseWithProgressWithCategory = Course & {
	progress: number | null;
	category: Category | null;
	chapters: { id: string }[];
};

interface ICoursesList {
	items: CourseWithProgressWithCategory[];
}
export function CoursesList({ items }: ICoursesList) {
	return (
		<div>
			<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
				{items.map((item) => (
					<CourseCard
						key={item.id}
						id={item.id}
						title={item.title}
						imageUrl={item.imageUrl!}
						chaptersLength={item.chapters.length}
						price={item.price!}
						progress={item.progress}
						category={item?.category?.name!}
					/>
				))}
			</div>
			{items.length === 0 && (
				<div className="mt-10 text-center text-sm text-muted-foreground">
					No courses found
				</div>
			)}
		</div>
	);
}
