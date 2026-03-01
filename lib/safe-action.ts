import { logError, ErrorContext } from "./error-handler";

type ActionResponse<T> = { success: true; data: T } | { success: false; error: string; details?: any };

/**
 * Wrapper for Server Actions catching unexpected errors and logging them securely.
 */
export function safeAction<TInput, TOutput>(
    actionName: string,
    handler: (input: TInput) => Promise<TOutput>,
    options?: { logInputs?: boolean } // Set to false if input has passwords
) {
    return async (input: TInput): Promise<ActionResponse<TOutput>> => {
        try {
            const data = await handler(input);
            return { success: true, data };
        } catch (error: any) {
            const context: ErrorContext = {
                action: actionName,
                params: options?.logInputs !== false ? input : '[REDACTED]',
                tags: ['server-action']
            };

            // Custom error formatting
            if (error?.message?.includes("Stok")) {
                await logError(error, 'warn', context);
                return { success: false, error: error.message }; // User-friendly warning
            }

            // Unknown fatal crash
            await logError(error, 'critical', context);

            return {
                success: false,
                error: "Terjadi kesalahan internal. Tim engineer kami telah diberitahu.",
            };
        }
    };
}
