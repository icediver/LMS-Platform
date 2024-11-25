import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { Banner } from '@/components/teacher/courses/banner';
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
						playbackId={muxData?.playbackId!}
						isLocked={isLocked}
						completeOnEnd={completeOnEnd}
					/>
				</div>
			</div>
		</div>
	);
}
