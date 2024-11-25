'use client';

import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '../ui/shadcn/button';

import { formatPrice } from '@/lib/format';

interface ICourseEnrollButton {
	courseId: string;
	price: number;
}
export function CourseEnrollButton({ price, courseId }: ICourseEnrollButton) {
	const [isLoading, setIsLoading] = useState(false);

	async function onClick() {
		try {
			setIsLoading(true);
			const response = await axios.post(`/api/courses/${courseId}/checkout`);

			window.location.assign(response.data.url);
		} catch {
			toast.error('Something went wrong.');
		} finally {
			setIsLoading(false);
		}
	}
	return (
		<Button
			onClick={onClick}
			disabled={isLoading}
			size="sm"
			className="w-full md:w-auto">
			Enroll for {formatPrice(price)}
		</Button>
	);
}
