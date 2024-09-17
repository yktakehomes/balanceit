import { forwardRef } from "react";
import { FieldError } from "react-hook-form";

interface FormSelectProps
	extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label: string;
	error?: FieldError;
}
export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
	({ label, error, children, ...rest }, ref) => (
		<div>
			<label htmlFor={rest.id} className="pl-2">
				{label}
			</label>
			<select
				className="mt-2 block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
				{...rest}
				ref={ref}
			>
				{children}
			</select>
			{error && <span className="text-red-400">{error.message}</span>}
		</div>
	),
);
