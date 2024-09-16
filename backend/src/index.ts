import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
	res.send("Aloha!");
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
