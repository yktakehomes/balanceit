import { z } from "zod";

const timeframeOptions = ["MONTH", "QUARTER", "YEAR"] as const;
export type TimeframeOption = (typeof timeframeOptions)[number];
export const TimeframeOptions: TimeframeOption[] = [...timeframeOptions];

export const BalanceSheetQueryParams = z.object({
	date: z.optional(z.string().date()),
	periods: z.optional(z.number().min(1).max(11)),
	timeframe: z.optional(z.enum([...timeframeOptions])),
	trackingOptionID1: z.optional(z.string()),
	trackingOptionID2: z.optional(z.string()),
	standardLayout: z.optional(z.boolean()),
	paymentsOnly: z.optional(z.boolean()),
});

export type BalanceSheetQueryParams = z.infer<typeof BalanceSheetQueryParams>;

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
	RowType: string;
	Cells: BalanceSheetReportCell[];
}

export interface BalanceSheetReportCell {
	Value: string;
}

export interface BalanceSheetReportCellAttribute {
	Value: string;
	Id: string;
}
