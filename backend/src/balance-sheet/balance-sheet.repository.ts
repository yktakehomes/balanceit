import superagent from "superagent";
import { BalanceSheetQueryParams } from "./balance-sheet.model";

export class BalanceSheetRepository {
	public async fetchBalanceSheet(params: BalanceSheetQueryParams) {
		const response = await superagent
			.get(`${process.env.XERO_URL}/api.xro/2.0/Reports/BalanceSheet`)
			.query(params);

		return response.body;
	}
}
