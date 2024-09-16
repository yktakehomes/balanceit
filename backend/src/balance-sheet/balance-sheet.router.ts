import { Request, Response, NextFunction, Router } from "express";
import { BalanceSheetRepository } from "./balance-sheet.repository";
import { BalanceSheetQueryParams } from "./balance-sheet.model";

export function BalanceSheetRoutes(
	balanceSheetRepository: BalanceSheetRepository,
) {
	const router = Router();

	router.get(
		"/",
		async (
			req: Request<never, never, never, BalanceSheetQueryParams>,
			res: Response,
			next: NextFunction,
		) => {
			try {
				res
					.status(200)
					.send(await balanceSheetRepository.fetchBalanceSheet(req.query));
			} catch (error) {
				next(error);
			}
		},
	);

	return router;
}
