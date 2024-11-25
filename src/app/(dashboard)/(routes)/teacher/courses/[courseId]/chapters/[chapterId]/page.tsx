import { auth } from '@clerk/nextjs/server';
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Banner } from '@/components/teacher/courses/banner';
import { ChapterAccessForm } from '@/components/teacher/courses/chapter-access-form';
import { ChapterActions } from '@/components/teacher/courses/chapter-actions';
import { ChapterDescriptionForm } from '@/components/teacher/courses/chapter-description-form';
import { ChapterTitleForm } from '@/components/teacher/courses/chapter-title-form';
import { ChapterVideoForm } from '@/components/teacher/courses/chapter-video-form';
import { IconBadge } from '@/components/ui/icon-badge';

import { db } from '@/lib/db';

export default async function ChapterIdPage({
	params,
}: {
	params: Promise<{ courseId: string; chapterId: string }>;
}) {
	const { chapterId, courseId } = await params;
	const { userId } = await auth();
	if (!userId) {
		return redirect('/');
	}

	const chapter = await db.chapter.findUnique({
		where: {
			id: chapterId,
			courseId: courseId,
		},
		include: {
			muxData: true,
		},
	});

	if (!chapter) {
		return redirect('/');
	}

	const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

	const totalFields = requiredFields.length;
	const completedFields = requiredFields.filter(Boolean).length;

	const completionText = Math.round((completedFields / totalFields) * 100);

	const isComplete = requiredFields.every(Boolean);

	return (
		<>
			{!chapter.isPublished && (
				<Banner
					variant="warning"
					label="Chapter is unpublished. It will not be the course visible"
				/>
			)}
			<div className="p-6">
				<div className="flex items-center justify-between">
					<div className="w-full">
						<Link
							href={`/teacher/courses/${courseId}`}
							className="mb-6 flex items-center text-sm transition hover:opacity-75">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Course
						</Link>
						<div className="flex w-full items-center justify-between">
							<div className="flex flex-col gap-y-2">
								<h1 className="text-2xl font-medium">Chapter Creation</h1>
								<span className="text-sm text-slate-700">
									Complete all fields {completionText}
								</span>
							</div>
							<ChapterActions
								disabled={!isComplete}
								courseId={courseId}
								chapterId={chapterId}
								isPublished={chapter.isPublished}
							/>
						</div>
					</div>
				</div>
				<div className="grid-colss-1 mt-16 grid gap-6 md:grid-cols-2">
					<div className="space-y-4">
						<div>
							<div className="flex items-center gap-x-2">
								<IconBadge icon={LayoutDashboard} />
								<h2 className="text-xl">Customize you chapter</h2>
							</div>
							<ChapterTitleForm
								initialData={chapter}
								chapterId={chapterId}
								courseId={courseId}
							/>
							<ChapterDescriptionForm
								initialData={chapter}
								chapterId={chapterId}
								courseId={courseId}
							/>
						</div>
						<div>
							<div className="itemsj-center flex gap-x-2">
								<IconBadge icon={Eye} />
								<h2 className="text-xl">Access Settings</h2>
							</div>
						</div>
						<ChapterAccessForm
							initialData={chapter}
							courseId={courseId}
							chapterId={chapterId}
						/>
					</div>
					<div>
						<div className="flex items-center gap-x-2">
							<IconBadge icon={Video} />
							<h2 className="text-xl">Add a video</h2>
						</div>
						<ChapterVideoForm
							initialData={chapter}
							courseId={courseId}
							chapterId={chapterId}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
