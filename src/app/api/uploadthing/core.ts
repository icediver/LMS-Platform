import { auth } from '@clerk/nextjs/server';
import { type FileRouter, createUploadthing } from 'uploadthing/next';

import { isTeacher } from '@/lib/teacher';

const f = createUploadthing();

const handleAuth = async () => {
	const { userId } = await auth();
	const isAuthorized = isTeacher(userId);

	if (!userId || !isAuthorized) {
		throw new Error('Unauthorized');
	}
	return { userId };
};

export const ourFileRouter = {
	courseImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
		.middleware(async () => {
			const { userId } = await handleAuth();

			return { userId };
		})
		.onUploadError(({ error, fileKey }) => {
			console.log('onUploadError', error, fileKey);
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log('file url', file.url);
			return { uploadedBy: metadata.userId };
		}),
	courseAttachment: f([
		'text',
		'image',
		'video',
		'audio',
		'pdf',
	]).onUploadComplete(() => {}),
	chapterVideo: f({
		video: { maxFileCount: 1, maxFileSize: '512GB' },
	})
		.middleware(async () => await handleAuth())
		.onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
