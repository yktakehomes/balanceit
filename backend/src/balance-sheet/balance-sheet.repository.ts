import superagent from "superagent";
import {
	BalanceSheetQueryParams,
	BalanceSheetReports,
} from "./balance-sheet.model";

export class BalanceSheetRepository {
	public async fetchBalanceSheet(
		params: BalanceSheetQueryParams,
	): Promise<BalanceSheetReports> {
		const response = await superagent
			.get(`${process.env.XERO_URL}/api.xro/2.0/Reports/BalanceSheet`)
			.query(params);

		return response.body;
	}
}
