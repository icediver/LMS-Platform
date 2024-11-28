import { auth } from '@clerk/nextjs/server';
import Mux from '@mux/mux-node';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

const { video } = new Mux({
	tokenId: process.env.MUX_TOKEN_ID!,
	tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
	req: Request,
	{ params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
	try {
		const { chapterId, courseId } = await params;
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

		if (!chapter) {
			return new Response('Not found', { status: 404 });
		}

		if (chapter.videoUrl) {
			const existingMuxData = await db.muxData.findFirst({
				where: {
					chapterId: chapterId,
				},
			});

			if (existingMuxData) {
				try {
					await video.assets.delete(existingMuxData.assetId);
				} finally {
					await db.muxData.delete({
						where: {
							id: existingMuxData.id,
						},
					});
				}
			}
		}

		const deletedChapter = await db.chapter.delete({
			where: {
				id: chapterId,
			},
		});

		const publishedChaptersInCourse = await db.chapter.findMany({
			where: {
				courseId: courseId,
				isPublished: true,
			},
		});

		if (!publishedChaptersInCourse.length) {
			await db.course.update({
				where: {
					id: courseId,
				},
				data: {
					isPublished: false,
				},
			});
		}

		return NextResponse.json(deletedChapter);
	} catch (error) {
		console.error('[COURSES_CHAPTER_ID]', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
	try {
		const { chapterId, courseId } = await params;
		const { userId } = await auth();
		const { isPublished, ...values } = await req.json();

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

		const chapter = await db.chapter.update({
			where: {
				id: chapterId,
				courseId: courseId,
			},
			data: {
				...values,
			},
		});

		if (values.videoUrl) {
			const existingMuxData = await db.muxData.findFirst({
				where: {
					chapterId: chapterId,
				},
			});

			if (existingMuxData) {
				await video.assets.delete(existingMuxData.assetId);
				await db.muxData.delete({
					where: {
						id: existingMuxData.id,
					},
				});
			}

			const asset = await video.assets.create({
				input: values.videoUrl,
				playback_policy: ['public'],
				test: false,
			});

			await db.muxData.create({
				data: {
					chapterId: chapterId,
					assetId: asset.id,
					playbackId: asset.playback_ids?.[0].id,
				},
			});
		}

		return NextResponse.json(chapter);
	} catch (error) {
		console.log('[COURSES_CHAPTER_ID]', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
