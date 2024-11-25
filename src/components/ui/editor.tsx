import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill/dist/quill.snow.css';

interface IEditor {
	onChange: (value: string) => void;
	value: string;
}
export function Editor({ onChange, value }: IEditor) {
	const ReactQuill = useMemo(
		() => dynamic(() => import('react-quill-new'), { ssr: false }),
		[]
	);
	return (
		<div className="bg-white">
			<ReactQuill
				theme="snow"
				value={value}
				onChange={onChange}
			/>
		</div>
	);
}
