export default function CourseIdPage({
	params,
}: {
	params: { courseId: string };
}) {
	return <div>Course id: {params.courseId}</div>;
}
