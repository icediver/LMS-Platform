'use client';

import { Course } from '@prisma/client';
import '@uploadthing/react/styles.css';
import axios from 'axios';
import { ImageIcon, PencilIcon, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/shadcn/button';

interface IImageForm {
	initialData: Course;
	courseId: string;
}

export function ImageForm({ initialData, courseId }: IImageForm) {
	const [isEditing, setIsEditing] = useState(false);

	const toggleEdit = () => setIsEditing((current) => !current);

	const router = useRouter();

	async function onSubmit(values: { imageUrl: string }) {
		try {
			await axios.patch(`/api/courses/${courseId}`, values);
			toast.success('Course updated');
			toggleEdit();
			router.refresh();
		} catch {
			toast.error('Something went wrong');
		}
	}

	return (
		<div className="mt-6 rounded-md border bg-slate-100 p-4">
			<div className="flex items-center justify-between font-medium">
				Course image
				<Button
					onClick={toggleEdit}
					variant={'ghost'}>
					{isEditing && <>Cancel</>}
					{!isEditing && !initialData.imageUrl && (
						<>
							<PlusCircle className="mr-2 h-4 w-4" />
							Add an image
						</>
					)}
					{!isEditing && initialData.imageUrl && (
						<>
							<PencilIcon className="ml-2 h-4 w-4" />
							Edit Image
						</>
					)}
				</Button>
			</div>

			{!isEditing &&
				(!initialData.imageUrl ? (
					<div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
						<ImageIcon className="h-10 w-10 text-slate-500" />
					</div>
				) : (
					<div className="relative mt-2 aspect-video">
						<Image
							alt="Upload"
							fill
							className="rounded-md object-cover"
							src={initialData.imageUrl}
						/>
					</div>
				))}
			{isEditing && (
				<div>
					<FileUpload
						endpoint="courseImage"
						onChangeAction={(url) => {
							if (url) {
								onSubmit({ imageUrl: url });
							}
						}}
					/>
					<div className="mt-4 text-xs text-muted-foreground">
						16:9 aspect ration recommended
					</div>
				</div>
			)}
		</div>
	);
}
