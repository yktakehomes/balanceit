import { Request, Response, NextFunction, Router } from "express";
import { BalanceSheetRepository } from "./balance-sheet.repository";
import { BalanceSheetQueryParams } from "./balance-sheet.model";
import { validateQuery } from "../middleware/validate";

export function BalanceSheetRoutes(
	balanceSheetRepository: BalanceSheetRepository,
) {
	const router = Router();

	router.get(
		"/",
		validateQuery(BalanceSheetQueryParams),
		async (
			req: Request<never, never, never, BalanceSheetQueryParams>,
			res: Response,
			_next: NextFunction,
		) => {
			try {
				res
					.status(200)
					.send(await balanceSheetRepository.fetchBalanceSheet(req.query));
			} catch (error) {
				// This is likely to be an issue calling the API
				// In the real world, would log this and/or trigger an alert depending on severity
				// For this demo, going to throw a 500 Internal Server error
				res.status(500).send({ error: "Internal server error" });
			}
		},
	);

	return router;
}
