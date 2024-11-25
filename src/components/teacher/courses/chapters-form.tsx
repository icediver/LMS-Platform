'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Chapter, Course } from '@prisma/client';
import axios from 'axios';
import { Loader2, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { Button } from '@/components/ui/shadcn/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/shadcn/form';
import { Input } from '@/components/ui/shadcn/input';

import { ChapterList } from './chapter-list';
import { cn } from '@/lib/utils';

interface IChaptersForm {
	initialData: Course & { chapters: Chapter[] };
	courseId: string;
}

const formSchema = z.object({
	title: z.string().min(1),
});

export function ChaptersForm({ initialData, courseId }: IChaptersForm) {
	const [isCreating, setIsCreating] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);

	const toggleCreating = () => {
		setIsCreating((current) => !current);
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
		},
	});

	const { isSubmitting, isValid } = form.formState;

	const router = useRouter();

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await axios.post(`/api/courses/${courseId}/chapters`, values);
			toast.success('Chapter created');
			toggleCreating();
			router.refresh();
		} catch {
			toast.error('Something went wrong');
		}
	}

	async function onReorder(updatedData: { id: string; position: number }[]) {
		try {
			setIsUpdating(true);

			await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
				list: updatedData,
			});
			toast.success('Chapters reordered');
		} catch {
			toast.error('Something went wrong');
		} finally {
			setIsUpdating(false);
		}
	}

	function onEdit(id: string) {
		router.push(`/teacher/courses/${courseId}/chapters/${id}`);
	}

	return (
		<div className="relative mt-6 rounded-md border bg-slate-100 p-4">
			{isUpdating && (
				<div className="absolute right-0 top-0 flex h-full w-full items-center justify-center rounded-md bg-slate-500/20">
					<Loader2 className="h-6 w-6 animate-spin text-sky-700" />
				</div>
			)}
			<div className="flex items-center justify-between font-medium">
				Course chapters
				<Button
					onClick={toggleCreating}
					variant={'ghost'}>
					{isCreating ? (
						<>Cancel </>
					) : (
						<>
							<PlusCircle className="mr-2 h-4 w-4" />
							Add a chapter
						</>
					)}
				</Button>
			</div>

			{isCreating && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="mt-4 flex flex-col gap-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="e.g. 'Introduction to the course'"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							disabled={!isValid || isSubmitting}
							type="submit">
							Create
						</Button>
					</form>
				</Form>
			)}
			{!isCreating && (
				<div
					className={cn(
						'mt-2 text-sm',
						!initialData.chapters.length && 'italic text-slate-500'
					)}>
					{!initialData.chapters.length && 'No chapters created yet'}
					<ChapterList
						onEdit={onEdit}
						onReorder={onReorder}
						items={initialData.chapters || []}
					/>
				</div>
			)}
			{!isCreating && (
				<p className="mt-4 text-xs text-muted-foreground">
					Drag and drop to reorder the chapters
				</p>
			)}
		</div>
	);
}
