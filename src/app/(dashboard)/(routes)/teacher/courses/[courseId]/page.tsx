import { auth } from '@clerk/nextjs/server';
import {
	CircleDollarSign,
	File,
	LayoutDashboard,
	ListChecks,
} from 'lucide-react';
import { redirect } from 'next/navigation';

import { Actions } from '@/components/teacher/courses/actions';
import { AttachmentForm } from '@/components/teacher/courses/attachment-form';
import { Banner } from '@/components/teacher/courses/banner';
import { CategoryForm } from '@/components/teacher/courses/category-form';
import { ChaptersForm } from '@/components/teacher/courses/chapters-form';
import { DescriptionForm } from '@/components/teacher/courses/description-form';
import { ImageForm } from '@/components/teacher/courses/image-form';
import { PriceForm } from '@/components/teacher/courses/price-form';
import { TitleForm } from '@/components/teacher/courses/title-form';
import { IconBadge } from '@/components/ui/icon-badge';

import { db } from '@/lib/db';

export default async function CourseIdPage({
	params,
}: {
	params: Promise<{ courseId: string }>;
}) {
	const { userId } = await auth();
	const { courseId } = await params;

	if (!userId) {
		return redirect('/');
	}

	const course = await db.course.findUnique({
		where: {
			id: courseId,
			userId,
		},
		include: {
			attachments: {
				orderBy: {
					createdAt: 'desc',
				},
			},
			chapters: {
				orderBy: {
					position: 'asc',
				},
			},
		},
	});

	const categories = await db.category.findMany({
		orderBy: {
			name: 'asc',
		},
	});

	if (!course) {
		return redirect('/');
	}

	const requiredFields = [
		course.title,
		course.description,
		course.imageUrl,
		course.price,
		course.categoryId,
		course.chapters.some((chapter) => chapter.isPublished),
	];

	const totalFields = requiredFields.length;
	const completedFields = requiredFields.filter(Boolean).length;

	const complectionText = `(${completedFields}/${totalFields})`;

	const isCopmlete = requiredFields.every(Boolean);

	return (
		<>
			{!course.isPublished && (
				<Banner
					label={
						'This course is unpublished. It will not visible be to students.'
					}
				/>
			)}
			<div className="p-6">
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-y-2">
						<h1 className="text-2xl font-medium">Course setup</h1>
						<span className="text-sm text-slate-700">
							Completed all fields {complectionText}
						</span>
					</div>
					<Actions
						disabled={!isCopmlete}
						courseId={course.id}
						isPublished={course.isPublished}
					/>
				</div>
				<div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
					<div className="">
						<div className="flex items-center gap-x-2">
							<IconBadge icon={LayoutDashboard} />
							<h2 className="text-xl">Customize your course</h2>
						</div>
						<TitleForm
							initialData={course}
							courseId={course.id}
						/>
						<DescriptionForm
							initialData={course}
							courseId={course.id}
						/>
						<ImageForm
							initialData={course}
							courseId={course.id}
						/>
						<CategoryForm
							options={categories.map((category) => ({
								label: category.name,
								value: category.id,
							}))}
							initialData={course}
							courseId={course.id}
						/>
					</div>
					<div className="space-y-6">
						<div className="">
							<div className="flex items-center gap-x-2">
								<IconBadge icon={ListChecks} />
								<h2 className="text-xl">Course chapters</h2>
							</div>
							<ChaptersForm
								initialData={course}
								courseId={course.id}
							/>
						</div>
						<div className="">
							<div className="flex items-center gap-x-2">
								<IconBadge icon={CircleDollarSign} />
								<h2 className="text-xl">Sell your course</h2>
							</div>
							<PriceForm
								initialData={course}
								courseId={course.id}
							/>
						</div>
						<div>
							<div className="flex items-center gap-x-2">
								<IconBadge icon={File} />
								<h2 className="text-xl">Resources and attachments</h2>
							</div>
							<AttachmentForm
								initialData={course}
								courseId={course.id}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
