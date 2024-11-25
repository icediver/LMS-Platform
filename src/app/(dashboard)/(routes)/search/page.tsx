import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { Categories } from '@/components/categories/categories';
import { CoursesList } from '@/components/courses/courses-list';
import { SearchInput } from '@/components/search-input';

import { getCourses } from '@/actions/get-courses';
import { db } from '@/lib/db';

interface ISearchPage {
	searchParams: {
		title: string;
		categoryId: string;
	};
}

export default async function SearchPage(params: Promise<ISearchPage>) {
	const { userId } = await auth();

	if (!userId) {
		return redirect('/');
	}

	const categories = await db.category.findMany({
		orderBy: {
			name: 'asc',
		},
	});

	const courses = await getCourses({
		userId,
		...(await params).searchParams,
	});

	return (
		<>
			<div className="block px-6 pt-6 md:mb-0 md:hidden">
				<SearchInput />
			</div>
			<div className="space-y-4 p-6">
				<Categories items={categories} />
				<CoursesList items={courses} />
			</div>
		</>
	);
}
