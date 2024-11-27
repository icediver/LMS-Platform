import { auth } from '@clerk/nextjs/server';
import { CheckCircle, Clock } from 'lucide-react';
import { redirect } from 'next/navigation';

import { CoursesList } from '@/components/courses/courses-list';
import InfoCard from '@/components/courses/info-card';

import { getDashboardCourses } from '@/actions/get-dashboard-courses';

export default async function DashboardPage() {
	const { userId } = await auth();

	if (!userId) {
		return redirect('/');
	}

	const { completedCourses, coursesInProgress } =
		await getDashboardCourses(userId);

	return (
		<div className="space-y-4 p-6">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<InfoCard
					icon={Clock}
					label="In Progress"
					numberOfItems={coursesInProgress.length}
				/>
				<InfoCard
					icon={CheckCircle}
					label="Completed"
					numberOfItems={completedCourses.length}
					variant="success"
				/>
			</div>
			<CoursesList items={[...coursesInProgress, ...completedCourses]} />
		</div>
	);
}
