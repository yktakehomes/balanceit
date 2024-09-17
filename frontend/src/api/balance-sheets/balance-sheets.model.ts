import { z } from "zod";

export const TimeframeOptions = ["MONTH", "QUARTER", "YEAR"] as const;
export type TimeframeOption = (typeof TimeframeOptions)[number];

export const BalanceSheetQueryParams = z.object({
	date: z.optional(z.string().date()),
	periods: z.optional(z.coerce.number().min(1).max(11)),
	timeframe: z.optional(z.enum([...TimeframeOptions])),
	trackingOptionID1: z.optional(z.string()),
	trackingOptionID2: z.optional(z.string()),
	// Query params are always string, so we need to coerce into boolean (if it is a valid boolean string)
	standardLayout: z.optional(z.coerce.boolean()),
	paymentsOnly: z.optional(z.coerce.boolean()),
});

export type BalanceSheetQueryParams = z.infer<typeof BalanceSheetQueryParams>;

export interface BalanceSheetReports {
	Status: string; // Note that this was in the API response from Docker, but not in the documentation. Unsure the valid values here
	Reports: BalanceSheetReport[];
}

export interface BalanceSheetReport {
	ReportId: string;
	ReportName: string;
	ReportType: string; // Presumably this is always BalanceSheet in this case?
	ReportTitles: string[];
	ReportDate: string;
	UpdatedDateUTC: string; // Note this is in MSJSON format - https://github.com/XeroAPI/Xero-OpenAPI/issues/109
	Rows: BalanceSheetReportRow[];
}

export interface BalanceSheetReportRow {
	RowType: "Header" | "Section" | "Row" | "SummaryRow";
	Title?: string;
	Cells: BalanceSheetReportCell[];
	Rows?: BalanceSheetReportRow[];
}

export interface BalanceSheetReportCell {
	Value: string;
}

export interface BalanceSheetReportCellAttribute {
	Value: string;
	Id: string;
}
