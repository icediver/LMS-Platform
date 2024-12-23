'use client';

import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/shadcn/button';

import { useConfettiStore } from '@/hooks/use-confetti-store';

interface IActions {
	disabled: boolean;
	courseId: string;
	isPublished: boolean;
}
export function Actions({ disabled, courseId, isPublished }: IActions) {
	const router = useRouter();
	const confetti = useConfettiStore();
	const [isLoading, setIsLoading] = useState(false);

	async function onDelete() {
		try {
			setIsLoading(true);
			await axios.delete(`/api/courses/${courseId}`);
			toast.success('Course deleted.');

			router.refresh();

			router.push(`/teacher/courses/`);
		} catch {
			toast.error('Something went wrong.');
		} finally {
			setIsLoading(false);
		}
	}

	async function onClick() {
		try {
			setIsLoading(true);

			if (isPublished) {
				await axios.patch(`/api/courses/${courseId}/unpublish`);
				toast.success('Course unpublished.');
			} else {
				await axios.patch(`/api/courses/${courseId}/publish`);
				toast.success('Course published.');

				confetti.onOpen();
			}

			router.refresh();
		} catch {
			toast.error('Something went wrong.');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="flex items-center gap-x-2">
			<Button
				onClick={onClick}
				disabled={disabled || isLoading}
				variant="outline"
				size="sm">
				{isPublished ? 'Unpublish' : 'Publish'}
			</Button>
			<ConfirmModal onConfirm={onDelete}>
				<Button
					size="sm"
					disabled={isLoading}>
					<Trash className="h-4 w-4" />
				</Button>
			</ConfirmModal>
		</div>
	);
}
