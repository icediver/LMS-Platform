import { Attachment, Chapter } from '@prisma/client';

import { db } from '@/lib/db';

interface IGetChapter {
	userId: string;
	courseId: string;
	chapterId: string;
}

export async function getChapter({ userId, courseId, chapterId }: IGetChapter) {
	try {
		const purchase = await db.purchase.findUnique({
			where: {
				userId_courseId: {
					userId,
					courseId,
				},
			},
		});

		const course = await db.course.findUnique({
			where: {
				isPublished: true,
				id: courseId,
			},
			select: {
				price: true,
			},
		});

		const chapter = await db.chapter.findUnique({
			where: {
				isPublished: true,
				id: chapterId,
			},
		});

		if (!chapter || !course) {
			throw new Error('Chapter or course not found');
		}

		let muxData = null;
		let attachments: Attachment[] = [];
		let nextChapter: Chapter | null = null;

		if (purchase) {
			attachments = await db.attachment.findMany({
				where: {
					courseId: courseId,
				},
			});
		}

		if (chapter.isFree || purchase) {
			muxData = await db.muxData.findUnique({
				where: {
					chapterId: chapterId,
				},
			});
			nextChapter = await db.chapter.findFirst({
				where: {
					courseId: courseId,
					isPublished: true,
					position: {
						gt: chapter?.position,
					},
				},
				orderBy: {
					position: 'asc',
				},
			});
		}

		const userProgress = await db.userProgress.findUnique({
			where: {
				userId_chapterId: {
					userId,
					chapterId: chapterId,
				},
			},
		});

		return {
			chapter,
			course,
			muxData,
			attachments,
			nextChapter,
			userProgress,
			purchase,
		};
	} catch (error) {
		console.log('[GET CHAPTER]', error);
		return {
			chapter: null,
			course: null,
			muxDate: null,
			attachments: [],
			nextChapter: null,
			userProgress: null,
			purchase: null,
		};
	}
}
