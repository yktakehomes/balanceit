import React, { forwardRef } from "react";
import { FieldError } from "react-hook-form";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: FieldError;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
	({ label, error, ...rest }, ref) => (
		<div className="flex flex-col gap-1">
			<label htmlFor={rest.id} className="pl-2">
				{label}
			</label>
			<input
				className="border border-gray-300 rounded-lg p-2 "
				{...rest}
				ref={ref}
			/>
			{error && <span className="text-red-400">{error.message}</span>}
		</div>
	),
);
