import { NextFunction, Request, Response } from "express";

export function unhandledErrors(
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	res.status(500).json({ error: "Internal Server Error" });
}
