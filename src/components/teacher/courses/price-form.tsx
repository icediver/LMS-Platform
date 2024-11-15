'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Course } from '@prisma/client';
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

import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';

interface IPriceForm {
	initialData: Course;
	courseId: string;
}

const formSchema = z.object({
	price: z.coerce.number(),
});

export function PriceForm({ initialData, courseId }: IPriceForm) {
	const [isEditing, setIsEditing] = useState(false);

	const toggleEdit = () => setIsEditing((current) => !current);

	const form = useForm<
		{ price: number | string },
		void,
		z.infer<typeof formSchema>
	>({
		resolver: zodResolver(formSchema),
		defaultValues: { price: initialData?.price ?? '' },
	});

	const { isSubmitting, isValid } = form.formState;

	const router = useRouter();

	async function onSubmit(values: z.infer<typeof formSchema>) {
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
				Course title
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

			{!isEditing && (
				<p
					className={cn(
						'mt-2 text-sm',
						!initialData.price && 'italic text-slate-500'
					)}>
					{initialData.price ? formatPrice(initialData.price) : 'No price'}
				</p>
			)}

			{isEditing && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="mt-4 space-y-4">
						<FormField
							control={form.control}
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type="number"
											step="0.01"
											disabled={isSubmitting}
											placeholder="Set a price for your course"
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
