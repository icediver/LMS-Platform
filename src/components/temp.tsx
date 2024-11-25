import { useState } from 'react';

import { Banner } from './teacher/courses/banner';

interface ITemp {
	state: string;
}
//FIX: remove this
//
export function Temp(props: ITemp) {
	const [isUnknown, setIsUnknown] = useState(false);

	return (
		<div className="bg-cyan-500">
			<button
				className="absolute border-2 bg-cyan-500"
				onClick={() => setIsUnknown(!isUnknown)}>
				Toggle Unknown
			</button>
			<Banner
				label={
					'This course is unpublished. It will not  visible be to students.'
				}
			/>
		</div>
	);
}
