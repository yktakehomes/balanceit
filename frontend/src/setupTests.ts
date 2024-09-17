import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./mocks/server";

beforeAll(() => server.listen());
afterEach(() => {
	cleanup();
	server.resetHandlers();
});
afterAll(() => server.close());
