import { useQuery } from "@tanstack/react-query";
import { fetchBalanceSheetsQueryOptions } from "./api/balance-sheets/balance-sheets.queries";
import { useState } from "react";
import { BalanceSheetQueryParams } from "./api/balance-sheets/balance-sheets.model";
import clsx from "clsx";
import { Button } from "./components/Button";
import { BalanceSheet } from "./components/BalanceSheet";
import { BalanceSheetFilters } from "./components/BalanceSheetFilters";

export default function App() {
	const [openForm, setOpenForm] = useState(false);

	const [balanceSheetParams, setBalanceSheetParams] =
		useState<BalanceSheetQueryParams>({});
	const { data: balanceSheets } = useQuery(
		fetchBalanceSheetsQueryOptions(balanceSheetParams),
	);

	// NOTE: Wording of API documentation suggests that there will only be a single balance sheet
	// > Returns "a" balance sheet
	// Working under this assumption
	const balanceSheet = balanceSheets?.Reports[0];

	// NOTE: The `NetAsset` entry in the mock response seems odd - it may have been intended as a SummaryRow?
	// Keeping the formatting consistent; more likely to be a data problem than a special case
	return (
		<>
			<BalanceSheetFilters
				open={openForm}
				initialState={balanceSheetParams}
				onFiltersUpdated={setBalanceSheetParams}
				onClose={() => setOpenForm(false)}
			/>
			<div className="container mx-auto max-w-6xl p-16">
				<div className="flex justify-between items-center">
					<div className="flex flex-col">
						{balanceSheet?.ReportTitles.map((title, index) => (
							<div
								key={`title-${index}`}
								className={clsx({
									"text-2xl font-semibold": index === 0,
									"text-lg": index > 0,
								})}
							>
								{title}
							</div>
						))}
					</div>
					<div className="pr-8">
						<Button type="button" onClick={() => setOpenForm(true)}>
							Filter
						</Button>
					</div>
				</div>

				{balanceSheet && <BalanceSheet balanceSheet={balanceSheet} />}
			</div>
		</>
	);
}
