import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useErrorBalanceSheet, useSuccessBalanceSheet } from "./App.msw";

// TODO: Need more tests... add if have time
// - Check that query parametrs are sent correctly when set via the modal
// - Check that row types are rendered correctly

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
});
