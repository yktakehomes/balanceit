import { BalanceSheetReports } from "./api/balance-sheets/balance-sheets.model";
import { server } from "./mocks/server";
import { http, HttpResponse } from "msw";

export const useErrorBalanceSheet = () =>
	server.use(
		http.get("*/api/balance-sheets", () => {
			return new HttpResponse(null, { status: 500 });
		}),
	);

export const useSuccessBalanceSheet = () =>
	server.use(
		http.get("*/api/balance-sheets", () => {
			return new HttpResponse(
				JSON.stringify({
					Status: "OK",
					Reports: [
						{
							ReportTitles: ["Balance Sheet"],
						},
					],
				} as Partial<BalanceSheetReports>),
				{ status: 200 },
			);
		}),
	);
