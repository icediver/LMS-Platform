'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { PencilIcon } from 'lucide-react';
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

interface IChapterTitleForm {
	initialData: {
		title: string;
	};
	courseId: string;
	chapterId: string;
}

const formSchema = z.object({
	title: z.string().min(1),
});

export function ChapterTitleForm({
	initialData,
	courseId,
	chapterId,
}: IChapterTitleForm) {
	const [isEditing, setIsEditing] = useState(false);

	const toggleEdit = () => setIsEditing((current) => !current);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData,
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
				Chapter title
				<Button
					onClick={toggleEdit}
					variant={'ghost'}>
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<PencilIcon className="ml-2 h-4 w-4" />
							Edit title
						</>
					)}
				</Button>
			</div>

			{!isEditing && <p className="mt-2 text-sm">{initialData.title}</p>}
			{isEditing && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="mt-4 space-y-4">
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
