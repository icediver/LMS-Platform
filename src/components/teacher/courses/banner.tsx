import { type VariantProps, cva } from 'class-variance-authority';
import { AlertTriangle, CheckCircleIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

const bannerVariants = cva(
	'flex w-full items-center border p-4 text-center text-sm',
	{
		variants: {
			variant: {
				warning: 'border-yellow-300 bg-yellow-200/80 text-primary',
				success: 'border-emerald-800 bg-emerald-700 text-secondary',
			},
		},
		defaultVariants: {
			variant: 'warning',
		},
	}
);

interface IBannerProps extends VariantProps<typeof bannerVariants> {
	label: string;
}

const iconMap = {
	warning: AlertTriangle,
	success: CheckCircleIcon,
};

export function Banner({ label, variant }: IBannerProps) {
	const Icon = iconMap[variant || 'warning'];

	return (
		<div className={cn(bannerVariants({ variant }))}>
			<Icon className="mr-2 h-4 w-4" />
			{label}
		</div>
	);
}
