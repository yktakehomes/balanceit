import { queryOptions } from "@tanstack/react-query";
import { BalanceSheetQueryParams } from "./balance-sheets.model";
import { fetchBalanceSheets } from "./balance-sheets.api";

export const fetchBalanceSheetsQueryOptions = (
	params: BalanceSheetQueryParams,
) =>
	queryOptions({
		queryKey: ["balance-sheets", params],
		queryFn: async () => fetchBalanceSheets(params),
	});
