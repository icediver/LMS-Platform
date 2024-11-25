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
	{ params }: { params: Promise<{ courseId: string }> }
) {
	try {
		const { userId } = await auth();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const { courseId } = await params;

		const course = await db.course.findUnique({
			where: {
				id: courseId,
				userId,
			},
			include: {
				chapters: {
					include: {
						muxData: true,
					},
				},
			},
		});

		console.log(course, 'deleted course');

		if (!course) {
			return new NextResponse('Not found', { status: 404 });
		}

		for (const chapter of course.chapters) {
			if (chapter.muxData?.assetId) {
				await video.assets.delete(chapter.muxData.assetId);
			}
		}

		const deletedCourse = await db.course.delete({
			where: {
				id: courseId,
				userId,
			},
		});

		return NextResponse.json(deletedCourse);
	} catch (error) {
		console.log('[COURSE_ID_DELETE]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: Promise<{ courseId: string }> }
) {
	try {
		const { userId } = await auth();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const { courseId } = await params;

		const values = await req.json();

		const course = await db.course.update({
			where: {
				id: courseId,
				userId,
			},
			data: {
				...values,
			},
		});

		return NextResponse.json(course);
	} catch (error) {
		console.log('[COURSE_ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
