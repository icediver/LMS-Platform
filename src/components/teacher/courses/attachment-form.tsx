'use client';

import { Attachment, Course } from '@prisma/client';
import '@uploadthing/react/styles.css';
import axios from 'axios';
import { File, Loader2, PlusCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/shadcn/button';

interface IAttachmentForm {
	initialData: Course & { attachments: Attachment[] };
	courseId: string;
}

export const attachmentsFormSchema = z.object({
	url: z.string().min(1),
});

export function AttachmentForm({ initialData, courseId }: IAttachmentForm) {
	const [isEditing, setIsEditing] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const toggleEdit = () => setIsEditing((current) => !current);

	const router = useRouter();

	async function onSubmit(values: z.infer<typeof attachmentsFormSchema>) {
		try {
			await axios.post(`/api/courses/${courseId}/attachments`, values);
			toast.success('Course updated');
			toggleEdit();
			router.refresh();
		} catch {
			toast.error('Something went wrong');
		}
	}

	async function onDelete(attachmentId: string) {
		try {
			setDeletingId(attachmentId);
			await axios.delete(
				`/api/courses/${courseId}/attachments/${attachmentId}`
			);
			toast.success('Attachment deleted');
			router.refresh();
		} catch {
			toast.error('Something went wrong');
		} finally {
			setDeletingId(null);
		}
	}

	return (
		<div className="mt-6 flex rounded-md border bg-slate-100 p-4">
			<div className=" items-center justify-between font-medium">
				Course attachments
				<Button
					onClick={toggleEdit}
					variant={'ghost'}
				>
					{isEditing && <>Cancel</>}
					{!isEditing && (
						<>
							<PlusCircle className="mr-2 h-4 w-4" />
							Add an file
						</>
					)}
				</Button>
			</div>

			{!isEditing && (
				<>
					{initialData.attachments.length === 0 && (
						<p className="mt-2 text-sm italic text-slate-500">
							No attachments yet
						</p>
					)}

					{initialData.attachments.length > 0 && (
						<div className="space-y-2">
							{initialData.attachments.map((attachment) => (
								<div
									key={attachment.id}
									className="flex w-full items-center rounded-md border border-sky-200 bg-sky-100 p-3 text-sky-700"
								>
									<File className="mr-2 h-4 w-4 flex-shrink-0" />
									<p className="line-clamp-1 text-xs">{attachment.name}</p>
									{deletingId === attachment.id && (
										<div>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										</div>
									)}
									{deletingId !== attachment.id && (
										<button
											className="ml-auto transition hover:opacity-75"
											onClick={() => onDelete(attachment.id)}
										>
											<X className="h-4 w-4" />
										</button>
									)}
								</div>
							))}
						</div>
					)}
				</>
			)}
			{isEditing && (
				<div>
					<FileUpload
						endpoint="courseAttachment"
						onChangeAction={(url) => {
							if (url) {
								onSubmit({ url: url });
							}
						}}
					/>
					<div className="mt-4 text-xs text-muted-foreground">
						Add anything your students might need to complete the course
					</div>
				</div>
			)}
		</div>
	);
}
