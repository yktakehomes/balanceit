import clsx from "clsx";
import React from "react";

export const Button = ({
	className,
	...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
	<button
		{...rest}
		className={clsx(
			"rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600",
			className,
		)}
	/>
);
