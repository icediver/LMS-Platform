'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Chapter } from '@prisma/client';
import axios from 'axios';
import { PencilIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { Editor } from '@/components/ui/editor';
import { Preview } from '@/components/ui/preview';
import { Button } from '@/components/ui/shadcn/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/shadcn/form';

import { cn } from '@/lib/utils';

interface IChapterDescriptionForm {
	initialData: Chapter;
	courseId: string;
	chapterId: string;
}

const formSchema = z.object({
	description: z.string().min(1),
});

export function ChapterDescriptionForm({
	initialData,
	courseId,
	chapterId,
}: IChapterDescriptionForm) {
	const [isEditing, setIsEditing] = useState(false);

	const toggleEdit = () => setIsEditing((current) => !current);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description: initialData?.description || '',
		},
	});

	const { isSubmitting, isValid } = form.formState;
	const router = useRouter();

	async function onSubmit(values: z.infer<typeof formSchema>) {
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
				Chapter description
				<Button
					onClick={toggleEdit}
					variant={'ghost'}>
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<PencilIcon className="ml-2 h-4 w-4" />
							Edit description
						</>
					)}
				</Button>
			</div>

			{!isEditing && (
				<div
					className={cn(
						'mt-2 text-sm',
						!initialData.description && 'italic text-slate-500'
					)}>
					{!initialData.description && 'No description'}
					{initialData.description && (
						<Preview value={initialData.description} />
					)}
				</div>
			)}
			{isEditing && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="mt-4 space-y-4">
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Editor {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-x-2">
							<Button
								disabled={!isValid || isSubmitting}
								type="submit">
								Save
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	);
}