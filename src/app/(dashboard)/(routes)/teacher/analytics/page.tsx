import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import Chart from '@/components/teacher/analitics/chart';
import DataCard from '@/components/teacher/data-card';

import { getAnalytics } from '@/actions/get-analitics';

export default async function AnalyticsPage() {
	const { userId } = await auth();
	if (!userId) redirect('/');
	const { data, totalRevenue, totalSales } = await getAnalytics(userId);

	return (
		<div className="p-6">
			<div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
				<DataCard
					label="Total Revenue"
					value={totalRevenue}
					shouldFormat
				/>
				<DataCard
					label="Total Sales"
					value={totalSales}
				/>
			</div>
			<Chart data={data} />
		</div>
	);
}
