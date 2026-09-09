/**
 * Utility functions to convert between snake_case and camelCase
 */

/**
 * Convert a snake_case string to camelCase
 */
function snakeToCamel(str: string): string {
	return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert a camelCase string to snake_case
 */
function camelToSnake(str: string): string {
	return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Recursively convert all keys in an object from snake_case to camelCase
 */
type PlainObject = Record<string, unknown>;

export function keysToCamel<T = unknown>(obj: unknown): T {
	if (obj === null || obj === undefined) {
		return obj as unknown as T;
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => keysToCamel(item)) as unknown as T;
	}

	if (typeof obj === "object" && obj.constructor === Object) {
		const source = obj as PlainObject;
		const result: PlainObject = {};
		for (const key of Object.keys(source)) {
			const camelKey = snakeToCamel(key);
			result[camelKey] = keysToCamel(source[key]);
		}
		return result as unknown as T;
	}

	return obj as T;
}

/**
 * Recursively convert all keys in an object from camelCase to snake_case
 */
export function keysToSnake<T = unknown>(obj: unknown): T {
	if (obj === null || obj === undefined) {
		return obj as unknown as T;
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => keysToSnake(item)) as unknown as T;
	}

	if (typeof obj === "object" && obj.constructor === Object) {
		const source = obj as PlainObject;
		const result: PlainObject = {};
		for (const key of Object.keys(source)) {
			const snakeKey = camelToSnake(key);
			result[snakeKey] = keysToSnake(source[key]);
		}
		return result as unknown as T;
	}

	return obj as T;
}
