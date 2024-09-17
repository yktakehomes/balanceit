import React, { forwardRef } from "react";
import { FieldError } from "react-hook-form";

interface FormInputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
	label: string;
	error?: FieldError;
}

export const FormCheckbox = forwardRef<HTMLInputElement, FormInputProps>(
	({ label, error, ...rest }, ref) => (
		<div className="flex flex-col gap-1">
			<div className="flex items-center gap-2">
				<input
					type="checkbox"
					className="border rounded p-2 text-green-600 focus:ring-green-600"
					{...rest}
					ref={ref}
				/>
				<label htmlFor={rest.id} className="pl-2">
					{label}
				</label>
			</div>
			{error && <span className="text-red-400">{error.message}</span>}
		</div>
	),
);
