import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { columns } from '@/components/teacher/courses/table/columns';
import { DataTable } from '@/components/teacher/courses/table/data-table';

import { db } from '@/lib/db';

export default async function CoursesPage() {
	const { userId } = await auth();
	if (!userId) {
		return redirect('/');
	}

	const courses = await db.course.findMany({
		where: {
			userId,
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	return (
		<div className="p-6">
			<DataTable
				columns={columns}
				data={courses}
			/>
		</div>
	);
}
