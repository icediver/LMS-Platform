import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '../ui/shadcn/alert-dialog';

interface IConfirmModal {
	children: React.ReactNode;
	onConfirm: () => void;
}

export function ConfirmModal({ children, onConfirm }: IConfirmModal) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Confirm</AlertDialogTitle>
					<AlertDialogDescription>Are you sure?</AlertDialogDescription>
					<AlertDialogDescription>
						This action cannot be undone
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
