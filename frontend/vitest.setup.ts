import "@testing-library/jest-dom/vitest";

Object.assign(process.env, {
	NODE_ENV: "test",
	BASE_API_URL: "http://localhost:8000/api/v1",
	API_TIMEOUT_MS: "30000",
	NEXT_PUBLIC_REGISTER_STORE_KEY: "test_key",
});

