import { LucideIcon } from 'lucide-react';

import { IconBadge } from '../ui/icon-badge';

interface IInfoCard {
	icon: LucideIcon;
	variant?: 'success' | 'default';
	label: string;
	numberOfItems: number;
}

export default function InfoCard({
	icon: Icon,
	label,
	numberOfItems,
	variant,
}: IInfoCard) {
	return (
		<div className="flex items-center gap-x-2 rounded-md border p-3">
			<IconBadge
				icon={Icon}
				variant={variant}
			/>
			<div className="">
				<p className="font-medium">{label}</p>
			</div>
			<p className="text-sm text-gray-500">
				{numberOfItems} {numberOfItems === 1 ? 'Course' : 'Courses'}
			</p>
		</div>
	);
}
