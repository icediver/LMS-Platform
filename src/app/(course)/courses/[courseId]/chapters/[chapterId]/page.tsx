import { auth } from '@clerk/nextjs/server';
import { File } from 'lucide-react';
import { redirect } from 'next/navigation';

import { CourseEnrollButton } from '@/components/courses/course-enroll-button';
import CourseProgressButton from '@/components/courses/course-progress-button';
import { Banner } from '@/components/teacher/courses/banner';
import { Preview } from '@/components/ui/preview';
import { Separator } from '@/components/ui/shadcn/separator';
import { VideoPlayer } from '@/components/ui/video-player';

import { getChapter } from '@/actions/get-chapter';

export default async function ChapterIdPage({
	params,
}: {
	params: Promise<{ courseId: string; chapterId: string }>;
}) {
	const { userId } = await auth();

	if (!userId) {
		return redirect('/');
	}

	const {
		chapter,
		course,
		attachments,
		muxData,
		nextChapter,
		userProgress,
		purchase,
	} = await getChapter({
		userId,
		courseId: (await params).courseId,
		chapterId: (await params).chapterId,
	});

	if (!chapter || !course) {
		return redirect('/');
		ot;
	}

	const isLocked = !chapter.isFree && !purchase;
	const completeOnEnd = !!purchase && !userProgress?.isCompleted;

	return (
		<div>
			{userProgress?.isCompleted && (
				<Banner
					label="You already completed this chapter"
					variant="success"
				/>
			)}
			{isLocked && (
				<Banner
					label="You need to purchase this course to watch this chapter."
					variant="warning"
				/>
			)}
			<div className="mx-auto flex max-w-4xl flex-col pb-20">
				<div className="p-4">
					<VideoPlayer
						chapterId={(await params).chapterId}
						title={chapter.title}
						courseId={(await params).courseId}
						nextChapterId={nextChapter?.id}
						playbackId={muxData?.playbackId || ''}
						isLocked={isLocked}
						completeOnEnd={completeOnEnd}
					/>
				</div>
				<div>
					<div className="flex flex-col items-center justify-between p-4 md:flex-row">
						<h2 className="mb-2 text-2xl font-semibold">{chapter.title}</h2>
						{purchase ? (
							<div>
								<CourseProgressButton
									chapterId={(await params).chapterId}
									courseId={(await params).courseId}
									nextChapterId={nextChapter?.id}
									isCompleted={!!userProgress?.isCompleted}
								/>
							</div>
						) : (
							<CourseEnrollButton
								courseId={(await params).courseId}
								price={course.price!}
							/>
						)}
					</div>
					<Separator />
					<div>
						<Preview value={chapter.description!} />
					</div>
					{!!attachments.length && (
						<>
							<Separator />
							<div className="p-4">
								{attachments.map((attachment) => (
									<a
										key={attachment.id}
										target="_blank"
										className="flex w-full items-center rounded-md border border-sky-700 bg-sky-200 p-3 hover:underline"
										href={attachment.url}>
										<File />
										<p className="line-clamp-1">{attachment.name}</p>
									</a>
								))}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
