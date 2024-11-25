import { BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { IconBadge } from '../ui/icon-badge';

import { formatPrice } from '@/lib/format';

interface ICourseCard {
	id: string;
	title: string;
	imageUrl: string;
	chaptersLength: number;
	price: number;
	progress: number | null;
	category: string;
}
export function CourseCard({
	id,
	title,
	imageUrl,
	chaptersLength,
	price,
	progress,
	category,
}: ICourseCard) {
	return (
		<Link href={`/courses/${id}`}>
			<div className="group h-full overflow-hidden rounded-lg border p-3 transition hover:shadow-sm">
				<div className="realative aspect-video w-full overflow-hidden rounded-md">
					<Image
						className="object-cover"
						alt={title}
						src={imageUrl}
						width={400}
						height={400}
					/>
				</div>
				<div className="flex flex-col pt-2">
					<div className="line-clamp-2 text-lg font-medium transition group-hover:text-sky-700 md:text-base">
						{title}
					</div>
					<p className="text-xs text-muted-foreground">{category}</p>
					<div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
						<div className="flex items-center gap-x-1 text-slate-500">
							<IconBadge
								icon={BookOpen}
								size="sm"
							/>
							<span>
								{chaptersLength} {chaptersLength === 1 ? 'Chapter' : 'Chapters'}
							</span>
						</div>
					</div>
					{progress !== null ? (
						<div>{/* TODO: Progress component */}</div>
					) : (
						<p className="text-md font-medium text-slate-700 md:text-sm">
							{formatPrice(price)}
						</p>
					)}
				</div>
			</div>
		</Link>
	);
}
