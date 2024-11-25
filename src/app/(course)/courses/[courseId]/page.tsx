import { redirect } from 'next/navigation';

import { db } from '@/lib/db';

export default async function CourseIdPage({
	params,
}: {
	params: Promise<{ courseId: string }>;
}) {
	const course = await db.course.findUnique({
		where: {
			id: (await params).courseId,
		},
		include: {
			chapters: {
				where: {
					isPublished: true,
				},
				orderBy: {
					position: 'asc',
				},
			},
		},
	});

	if (!course) {
		redirect('/');
	}

	return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
}
