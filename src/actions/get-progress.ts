import { db } from '@/lib/db';

export async function getProgress(
	userId: string,
	courseId: string
): Promise<number> {
	try {
		const publishedChapters = await db.chapter.findMany({
			where: {
				courseId,
				isPublished: true,
			},
			select: {
				id: true,
			},
		});

		const publishedChaptersIds = publishedChapters.map((chapter) => chapter.id);

		const validCopmletedChapters = await db.userProgress.count({
			where: {
				userId,
				chapterId: {
					in: publishedChaptersIds,
				},
				isCompleted: true,
			},
		});
		const progressProcentage =
			(validCopmletedChapters / publishedChapters.length) * 100;
		return progressProcentage;
	} catch (error) {
		console.log('[GET_PROGRESS]', error);
		return 0;
	}
}
