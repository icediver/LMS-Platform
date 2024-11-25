import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function PATCH(
	req: Request,
	{ params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
	const { chapterId, courseId } = await params;
	try {
		const { userId } = await auth();
		if (!userId) {
			return new Response('Unauthorized', { status: 401 });
		}

		const ownCourse = await db.course.findUnique({
			where: {
				id: courseId,
				userId,
			},
		});

		if (!ownCourse) {
			return new Response('Unauthorized', { status: 401 });
		}

		const chapter = await db.chapter.findUnique({
			where: {
				id: chapterId,
				courseId: courseId,
			},
		});

		const muxData = await db.muxData.findUnique({
			where: {
				chapterId: chapterId,
			},
		});

		if (
			!chapter ||
			!muxData ||
			!chapter.title ||
			!chapter.description ||
			!chapter.videoUrl
		) {
			return new Response('Missing required fields', { status: 400 });
		}
		const publishedChapter = await db.chapter.update({
			where: {
				id: chapterId,
				courseId: courseId,
			},
			data: {
				isPublished: true,
			},
		});

		return NextResponse.json(publishedChapter);
	} catch (error) {
		console.log('[CHAPTER_PUBLISH]', error);
		return new Response('Interlal server erroor', { status: 500 });
	}
}
