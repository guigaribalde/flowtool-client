import { cn } from '@/lib/utils';

interface SubmitButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
	formik: any;
}

export default function SubmitButton({
	formik,
	children,
	className,
	...rest
}: SubmitButtonProps) {
	return (
		<button
			disabled={formik.isSubmitting || formik.isValidating}
			type="submit"
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...rest}
			className={cn('btn btn-primary w-full', className)}
		>
			{formik.isSubmitting || formik.isValidating ? (
				<span className="loading loading-spinner" />
			) : (
				''
			)}
			{children}
		</button>
	);
}
