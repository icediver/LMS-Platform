import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { IconType } from 'react-icons';

import { cn } from '@/lib/utils';

interface ICategoryItem {
	label: string;
	icon?: IconType;
	value?: string;
}
export function CategoryItem({ label, icon: Icon, value }: ICategoryItem) {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const categoryId = searchParams.get('categoryId');
	const currentTitle = searchParams.get('title');

	const isSelected = categoryId === value;

	function onClick() {
		const url = qs.stringifyUrl(
			{
				url: pathname,
				query: {
					title: currentTitle,
					categoryId: isSelected ? null : value,
				},
			},
			{ skipEmptyString: true, skipNull: true }
		);
		router.push(url);
	}

	return (
		<button
			onClick={onClick}
			className={cn(
				'flex items-center gap-x-1 rounded-full border border-slate-200 px-3 py-2 text-sm transition hover:border-sky-700',
				isSelected && 'border-sky-700 bg-sky-200 text-sky-800'
			)}>
			{Icon && <Icon size={20} />} <div className="truncate">{label}</div>
		</button>
	);
}
