'use client';

import MuxPlayer from '@mux/mux-player-react';
import { Chapter, Course, MuxData } from '@prisma/client';
import '@uploadthing/react/styles.css';
import axios from 'axios';
import { ImageIcon, PencilIcon, PlusCircle, Video } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/shadcn/button';

interface IChapterVideoForm {
	initialData: Chapter & { muxData?: MuxData | null };
	courseId: string;
	chapterId: string;
}

const formSchema = z.object({
	videoUrl: z.string().min(1),
});

export function ChapterVideoForm({
	initialData,
	courseId,
	chapterId,
}: IChapterVideoForm) {
	const [isEditing, setIsEditing] = useState(false);

	const toggleEdit = () => setIsEditing((current) => !current);

	const router = useRouter();

	async function onSubmit(values: { videoUrl: string }) {
		try {
			await axios.patch(
				`/api/courses/${courseId}/chapters/${chapterId}`,
				values
			);
			toast.success('Chapter updated');
			toggleEdit();
			router.refresh();
		} catch {
			toast.error('Something went wrong');
		}
	}

	return (
		<div className="mt-6 rounded-md border bg-slate-100 p-4">
			<div className="flex items-center justify-between font-medium">
				Chapter video
				<Button
					onClick={toggleEdit}
					variant={'ghost'}>
					{isEditing && <>Cancel</>}
					{!isEditing && !initialData.videoUrl && (
						<>
							<PlusCircle className="mr-2 h-4 w-4" />
							Add a video
						</>
					)}
					{!isEditing && initialData.videoUrl && (
						<>
							<PencilIcon className="ml-2 h-4 w-4" />
							Edit video
						</>
					)}
				</Button>
			</div>

			{!isEditing &&
				(!initialData.videoUrl ? (
					<div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
						<Video className="h-10 w-10 text-slate-500" />
					</div>
				) : (
					<div className="relative mt-2 aspect-video">
						<MuxPlayer playbackId={initialData?.muxData?.playbackId || ''} />
					</div>
				))}
			{isEditing && (
				<div>
					<FileUpload
						endpoint="chapterVideo"
						onChangeAction={(url) => {
							if (url) {
								onSubmit({ videoUrl: url });
							}
						}}
					/>
					<div className="mt-4 text-xs text-muted-foreground">
						Upload this chapter&apos;s video
					</div>
				</div>
			)}
			{initialData.videoUrl && (
				<div className="mt-2 text-xs text-muted-foreground">
					Videos can take a few minutes to process. Refresh the page if video
					does not appear.
				</div>
			)}
		</div>
	);
}
