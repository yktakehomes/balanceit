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

export const useMockBalanceSheet = (
	mockFunction: (
		urlSearchParams: URLSearchParams,
	) => Partial<BalanceSheetReports>,
) =>
	server.use(
		http.get("*/api/balance-sheets", ({ request }) => {
			const url = new URL(request.url);
			const queryParams = url.searchParams;

			return new HttpResponse(JSON.stringify(mockFunction(queryParams)), {
				status: 200,
			});
		}),
	);
