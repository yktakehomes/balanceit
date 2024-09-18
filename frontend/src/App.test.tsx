import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	useErrorBalanceSheet,
	useMockBalanceSheet,
	useSuccessBalanceSheet,
} from "./App.msw";
import { BalanceSheetReports } from "./api/balance-sheets/balance-sheets.model";

describe("App", () => {
	it("should show error if fail to retrieve data from API", async () => {
		useErrorBalanceSheet();
		const queryClient = new QueryClient();
		render(
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>,
		);

		await waitFor(() => {
			expect(screen.getByTestId("loading-error")).toBeTruthy();
		});
	});

	it("should show balance sheet if successful response", async () => {
		useSuccessBalanceSheet();
		const queryClient = new QueryClient();
		render(
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>,
		);

		await waitFor(() => {
			expect(screen.getByTestId("report-title-0")).toBeTruthy();
		});
	});

	it.each`
		field                  | value               | testDescription
		${"date"}              | ${"2024-09-17"}     | ${"send date value if set"}
		${"periods"}           | ${"1"}              | ${"send periods value if set"}
		${"timeframe"}         | ${"MONTH"}          | ${"send timeframe value if set"}
		${"trackingOptionID1"} | ${"sometrackingid"} | ${"send trackingOptionID1 value if set"}
		${"trackingOptionID2"} | ${"sometrackingid"} | ${"send trackingOptionID2 value if set"}
	`("should $testDescription", async ({ field, value }) => {
		// Set initial error value to block loading
		useErrorBalanceSheet();

		const queryClient = new QueryClient();
		render(
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>,
		);

		// Show modal, enter designated value
		const filterButton = screen.getByRole("button", { name: "Filter" });
		filterButton.click();

		await waitFor(() => {
			expect(screen.getByTestId("balance-sheet-filters-form")).toBeTruthy();
		});

		const input = screen.getByTestId(field);
		fireEvent.change(input, { target: { value } });
		const submitButton = screen.getByRole("button", { name: "Update" });

		// Set up mock to check the url params sent
		const mockFn = vi.fn();
		mockFn.mockReturnValue({
			Reports: [
				{
					ReportTitles: ["Balance Sheet"],
				},
			],
		} as Partial<BalanceSheetReports>);
		useMockBalanceSheet(mockFn);

		// Submit form then wait for UI to load, indicating request has been made
		submitButton.click();

		await waitFor(() => {
			expect(screen.getByTestId("report-title-0")).toBeTruthy();
		});

		// Verify query params contain expected field
		const queryParams = mockFn.mock.lastCall?.at(0) as URLSearchParams;
		expect(queryParams.get(field)).toBe(value);
	});

	it.each`
		field               | value    | testDescription
		${"standardLayout"} | ${true}  | ${"send standardLayout = true"}
		${"standardLayout"} | ${false} | ${"send standardLayout = false"}
		${"paymentsOnly"}   | ${true}  | ${"send paymentsOnly = true"}
		${"paymentsOnly"}   | ${false} | ${"send paymentsOnly = false"}
	`("should $testDescription", async ({ field, value }) => {
		// Set initial error value to block loading
		useErrorBalanceSheet();

		const queryClient = new QueryClient();
		render(
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>,
		);

		// Show modal, enter designated value
		const filterButton = screen.getByRole("button", { name: "Filter" });
		filterButton.click();

		await waitFor(() => {
			expect(screen.getByTestId("balance-sheet-filters-form")).toBeTruthy();
		});

		const input = screen.getByTestId(field) as HTMLInputElement;
		if (input.checked !== value) {
			input.click();
		}
		const submitButton = screen.getByRole("button", { name: "Update" });

		// Set up mock to check the url params sent
		const mockFn = vi.fn();
		mockFn.mockReturnValue({
			Reports: [
				{
					ReportTitles: ["Balance Sheet"],
				},
			],
		} as Partial<BalanceSheetReports>);
		useMockBalanceSheet(mockFn);

		// Submit form then wait for UI to load, indicating request has been made
		submitButton.click();

		await waitFor(() => {
			expect(screen.getByTestId("report-title-0")).toBeTruthy();
		});

		// Verify query params contain expected field
		const queryParams = mockFn.mock.lastCall?.at(0) as URLSearchParams;
		expect(queryParams.get(field)).toBe(value.toString());
	});
});
