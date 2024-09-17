import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../components/Modal";
import { FormInput } from "../components/FormInput";
import { FormSelect } from "../components/FormSelect";
import { Button } from "../components/Button";
import {
	BalanceSheetQueryParams,
	TimeframeOptions,
} from "../api/balance-sheets/balance-sheets.model";
import { FormCheckbox } from "./FormCheckbox";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const BalanceSheetFiltersForm = z.object({
	date: z.optional(z.string().date()).or(z.literal("")),
	periods: z.optional(z.coerce.number().min(1).max(11)).or(z.literal("")),
	timeframe: z.optional(z.enum([...TimeframeOptions])).or(z.literal("")),
	trackingOptionID1: z.optional(z.string()),
	trackingOptionID2: z.optional(z.string()),
	// Query params are always string, so we need to coerce into boolean (if it is a valid boolean string)
	standardLayout: z.optional(z.coerce.boolean()),
	paymentsOnly: z.optional(z.coerce.boolean()),
});
type BalanceSheetFiltersForm = z.infer<typeof BalanceSheetFiltersForm>;

interface BalanceSheetFiltersProps {
	open: boolean;
	initialState?: BalanceSheetQueryParams;
	onFiltersUpdated: (filters: BalanceSheetQueryParams) => void;
	onClose: () => void;
}

export const BalanceSheetFilters = ({
	open,
	initialState,
	onFiltersUpdated,
	onClose,
}: BalanceSheetFiltersProps) => {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<BalanceSheetQueryParams>({
		resolver: zodResolver(BalanceSheetFiltersForm),
	});

	useEffect(() => {
		reset({
			...initialState,
		});
	}, [open, initialState]);

	const onSubmit = async (data: BalanceSheetFiltersForm) => {
		const processed = Object.fromEntries(
			Object.entries(data).filter(
				([, value]) => value !== "" && value !== undefined,
			),
		);
		onFiltersUpdated(BalanceSheetQueryParams.parse(processed));

		onClose();
	};

	return (
		<Modal open={open} onClose={onClose}>
			<div className="bg-white p-8 rounded-lg">
				<form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
					<FormInput
						id="date"
						type="date"
						label="Date"
						{...register("date")}
						error={errors.date}
					/>
					<FormInput
						id="periods"
						type="number"
						min="1"
						max="11"
						label="Periods"
						{...register("periods")}
						error={errors.periods}
					/>
					<FormSelect
						id="timeframe"
						label="Timeframe"
						{...register("timeframe")}
						error={errors.timeframe}
					>
						<option value={""}>None</option>
						{TimeframeOptions.map((o) => (
							<option key={o} value={o}>
								{o}
							</option>
						))}
					</FormSelect>
					<FormInput
						id="trackingOptionID1"
						label="Tracking Option ID 1"
						{...register("trackingOptionID1")}
						error={errors.trackingOptionID1}
					/>
					<FormInput
						id="trackingOptionID2"
						label="Tracking Option ID 2"
						{...register("trackingOptionID2")}
						error={errors.trackingOptionID2}
					/>

					<FormCheckbox
						id="standardLayout"
						label="Standard Layout"
						{...register("standardLayout")}
						error={errors.standardLayout}
					/>
					<FormCheckbox
						id="paymentsOnly"
						label="Payments Only"
						{...register("paymentsOnly")}
						error={errors.paymentsOnly}
					/>

					<Button type="submit">Update</Button>
				</form>
			</div>
		</Modal>
	);
};
