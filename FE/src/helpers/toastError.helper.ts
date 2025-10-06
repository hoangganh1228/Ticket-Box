/**
 * Extracts a readable error message from an error object (e.g., Axios error).
 *
 * - Looks into `error.response.data.message` if available.
 * - If `message` is an array, returns the first element.
 * - If `message` is a string, returns it directly.
 * - Falls back to `defaultMessage` when no valid message is found.
 *
 * @param error - The unknown error object (commonly from an API call).
 * @param defaultMessage - The fallback message when no error message is found.
 * @returns A string containing the error message.
 */

interface errorResponse {
    response?: {
        data?: {
            message?: string | string[];
        };
    };
}

export function getErrorMessage(
    error: unknown,
    defaultMessage = "An error occurred"
): string {
    const msg = (error as errorResponse)?.response?.data?.message;

    if (Array.isArray(msg)) {
        return msg[0] ?? defaultMessage;
    }

    return msg ?? defaultMessage;
}
