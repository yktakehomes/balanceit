import { describe, expect, it, vi } from "vitest";
import httpMocks from "node-mocks-http";
import querystring from "node:querystring";
import { BalanceSheetRepository } from "./balance-sheet.repository";
import { BalanceSheetRoutes } from "./balance-sheet.router";

function getMockRepository(): BalanceSheetRepository {
	return {
		fetchBalanceSheet: vi.fn(),
	};
}

describe("Balance sheet router", () => {
	it("should return 500 status code if repository has an error", () => {
		const mocks = httpMocks.createMocks({
			method: "GET",
			url: "/",
		});

		const repository = getMockRepository();

		// Simulate repository failing e.g. Xero api down
		repository.fetchBalanceSheet = vi.fn().mockImplementation(() => {
			throw "kaboom";
		});

		const router = BalanceSheetRoutes(repository);
		const nextFn = vi.fn();

		router(mocks.req, mocks.res, nextFn);

		expect(mocks.res.statusCode).toBe(500);
	});

	it.each`
		date            | periods      | timeframe    | trackingOptionID1 | trackingOptionID2 | standardLayout | paymentsOnly | testDescription
		${undefined}    | ${undefined} | ${undefined} | ${undefined}      | ${undefined}      | ${undefined}   | ${undefined} | ${"no parameters"}
		${"2024-09-16"} | ${undefined} | ${undefined} | ${undefined}      | ${undefined}      | ${undefined}   | ${undefined} | ${"valid date"}
		${undefined}    | ${1}         | ${undefined} | ${undefined}      | ${undefined}      | ${undefined}   | ${undefined} | ${"valid period - lower bound"}
		${undefined}    | ${11}        | ${undefined} | ${undefined}      | ${undefined}      | ${undefined}   | ${undefined} | ${"valid period - upper bound"}
		${undefined}    | ${undefined} | ${"MONTH"}   | ${undefined}      | ${undefined}      | ${undefined}   | ${undefined} | ${"valid timeframe - quarter"}
		${undefined}    | ${undefined} | ${"QUARTER"} | ${undefined}      | ${undefined}      | ${undefined}   | ${undefined} | ${"valid timeframe - month"}
		${undefined}    | ${undefined} | ${"YEAR"}    | ${undefined}      | ${undefined}      | ${undefined}   | ${undefined} | ${"valid timeframe - year"}
		${undefined}    | ${undefined} | ${undefined} | ${undefined}      | ${undefined}      | ${true}        | ${undefined} | ${"valid standardLayout"}
		${undefined}    | ${undefined} | ${undefined} | ${undefined}      | ${undefined}      | ${undefined}   | ${true}      | ${"valid paymentsOnly"}
		${undefined}    | ${undefined} | ${undefined} | ${"string"}       | ${undefined}      | ${undefined}   | ${true}      | ${"accepts trackingOptionID1"}
		${undefined}    | ${undefined} | ${undefined} | ${undefined}      | ${"string"}       | ${undefined}   | ${true}      | ${"accepts trackingOptionID2"}
	`(
		"should allow valid requests: $testDescription",
		({
			date,
			periods,
			timeframe,
			trackingOptionID1,
			trackingOptionID2,
			standardLayout,
			paymentsOnly,
		}) => {
			const params = Object.fromEntries(
				Object.entries({
					date,
					periods,
					timeframe,
					trackingOptionID1,
					trackingOptionID2,
					standardLayout,
					paymentsOnly,
				}).filter(([key, value]) => value !== undefined),
			);
			const queryString = querystring.stringify(params);

			const mocks = httpMocks.createMocks({
				method: "GET",
				url: `/?${queryString}`,
			});

			const repository = getMockRepository();
			const router = BalanceSheetRoutes(repository);
			const nextFn = vi.fn();

			router(mocks.req, mocks.res, nextFn);
			expect(repository.fetchBalanceSheet).toHaveBeenCalledOnce();

			expect(mocks.res.statusCode).toBe(200);
		},
	);

	// Note that tracking options are excluded as no known validation
	it.each`
		date            | periods      | timeframe    | standardLayout | paymentsOnly | invalidField        | testDescription
		${"not a date"} | ${undefined} | ${undefined} | ${undefined}   | ${undefined} | ${"date"}           | ${"invalid date"}
		${undefined}    | ${0}         | ${undefined} | ${undefined}   | ${undefined} | ${"periods"}        | ${"period less than minimum"}
		${undefined}    | ${12}        | ${undefined} | ${undefined}   | ${undefined} | ${"periods"}        | ${"period greater than maximum"}
		${undefined}    | ${undefined} | ${"WEEK"}    | ${undefined}   | ${undefined} | ${"timeframe"}      | ${"invalid timeframe"}
		${undefined}    | ${undefined} | ${undefined} | ${null}        | ${undefined} | ${"standardLayout"} | ${"invalid standardLayout"}
		${undefined}    | ${undefined} | ${undefined} | ${undefined}   | ${null}      | ${"paymentsOnly"}   | ${"invalid paymentsOnly"}
	`(
		"should return 400 Bad request when query is invalid: $testDescription",
		({
			date,
			periods,
			timeframe,
			standardLayout,
			paymentsOnly,
			invalidField,
		}) => {
			const params = Object.fromEntries(
				Object.entries({
					date,
					periods,
					timeframe,
					standardLayout,
					paymentsOnly,
				}).filter(([key, value]) => value !== undefined),
			);
			const queryString = querystring.stringify(params);

			const mocks = httpMocks.createMocks({
				method: "GET",
				url: `/?${queryString}`,
			});

			const repository = getMockRepository();
			const router = BalanceSheetRoutes(repository);
			const nextFn = vi.fn();

			router(mocks.req, mocks.res, nextFn);

			expect(mocks.res.statusCode).toBe(400);
			expect(repository.fetchBalanceSheet).not.toHaveBeenCalled();

			const errorDetails = mocks.res._getJSONData();
			expect(errorDetails.details.length).toBe(1);
			expect(errorDetails.details.at(0).target).toBe(invalidField);
		},
	);
});
