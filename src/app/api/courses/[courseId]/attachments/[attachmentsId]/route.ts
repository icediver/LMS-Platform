import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { isTeacher } from '@/lib/teacher';

export async function DELETE(
	req: Request,
	{ params }: { params: { courseId: string; attachmentsId: string } }
) {
	try {
		const { userId } = await auth();

		if (!userId || !isTeacher(userId)) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const courseOwner = await db.course.findUnique({
			where: {
				id: params.courseId,
				userId,
			},
		});

		if (!courseOwner) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const attachment = await db.attachment.delete({
			where: {
				id: params.attachmentsId,
				courseId: params.courseId,
			},
		});

		return NextResponse.json(attachment);
	} catch (error) {
		console.log('[ATTACHMENTS_ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
