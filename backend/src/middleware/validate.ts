import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export function validateQuery<T extends z.ZodTypeAny>(schema: T) {
	return (
		req: Request<unknown, unknown, unknown, z.infer<T>>,
		res: Response,
		next: NextFunction,
	) => {
		try {
			// Parse and replace the provided query
			// This strips any unexpected values + throws if the expected values are not valid
			req.query = schema.parse(req.query);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const errorMessages = error.errors.map((e) => ({
					target: e.path.join("."),
					message: e.message,
				}));
				res.status(400).json({ error: "Invalid data", details: errorMessages });
				return;
			}

			res.status(500).json({ error: "Internal Server Error" });
		}
	};
}
