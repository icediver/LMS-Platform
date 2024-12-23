'use client';

import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { useConfettiStore } from '@/hooks/use-confetti-store';

import { Button } from '../ui/shadcn/button';

interface ICourseProgressButton {
	chapterId: string;
	courseId: string;
	isCompleted?: boolean;
	nextChapterId?: string;
}

export default function CourseProgressButton({
	chapterId,
	courseId,
	isCompleted,
	nextChapterId,
}: ICourseProgressButton) {
	const router = useRouter();
	const Icon = isCompleted ? XCircle : CheckCircle;
	const confetti = useConfettiStore();
	const [isLoading, setIsLoading] = useState(false);

	async function onClick() {
		try {
			setIsLoading(true);
			await axios.put(
				`/api/courses/${courseId}/chapters/${chapterId}/progress`,
				{
					isCompleted: !isCompleted,
				}
			);

			if (!isCompleted && !nextChapterId) {
				confetti.onOpen();
			}
			if (!isCompleted && nextChapterId) {
				router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
			}
			toast.success('Progress updated');
			router.refresh();
		} catch {
			toast.error('Something went wrong.');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Button
			type="button"
			onClick={onClick}
			disabled={isLoading}
			variant={isCompleted ? 'outline' : 'success'}
			className="w-full md:w-auto">
			{isCompleted ? 'Not completed' : 'Mark as complete'}
			<Icon className="ml-2 h-4 w-4" />
		</Button>
	);
}
