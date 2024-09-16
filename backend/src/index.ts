import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { BalanceSheetRoutes } from "./balance-sheet/balance-sheet.router";
import { BalanceSheetRepository } from "./balance-sheet/balance-sheet.repository";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Note that this is manually "injected", but could alternatively use a dependency injection framework to handle this
const balanceSheetRepository = new BalanceSheetRepository();
app.use("/api/balance-sheets", BalanceSheetRoutes(balanceSheetRepository));

const port = process.env.PORT || 4000;
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
