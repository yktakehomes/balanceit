import {
	BalanceSheetQueryParams,
	BalanceSheetReport,
	BalanceSheetReportRow,
	BalanceSheetReports,
} from "./balance-sheets.model";

const headers = {
	"Content-Type": "application/json",
};

const asServerUrl = (fragment: string) =>
	`${import.meta.env.VITE_SERVER_URL}${fragment}`;

export async function fetchBalanceSheets(
	params: BalanceSheetQueryParams,
): Promise<BalanceSheetReports> {
	const stringifiedParams = Object.fromEntries(
		Object.entries(params)
			.filter(([, value]) => value !== undefined)
			.map(([key, value]) => [key, value.toString()]),
	);
	const urlSearchParams = new URLSearchParams(stringifiedParams);

	const response = await fetch(
		asServerUrl(`/api/balance-sheets?${urlSearchParams.toString()}`),
		{
			headers,
			method: "GET",
		},
	);

	// TODO: parse and convert date to JS date

	const reports = (await response.json()) as BalanceSheetReports;

	// NOTE: Wording of API documentation suggests that there will only be a single balance sheet
	// > Returns "a" balance sheet
	// Working under this assumption
	return {
		...reports,
		Reports: reports.Reports.map((report) => ({
			...report,
			Rows: flattenRows(report.Rows),
		})),
	};
}

const flattenRows = (
	rows: BalanceSheetReportRow[],
): BalanceSheetReportRow[] => {
	if (!rows || rows.length === 0) {
		return [];
	}

	return [
		...rows.flatMap((x) => [
			{
				RowType: x.RowType,
				Title: x.Title,
				Cells: x.Cells,
			},
			...flattenRows(x.Rows ?? []),
		]),
	];
};
