import { sendAdminNotification } from "./notifier";
import { createAdminClient } from "./supabase/admin";

type LogLevel = 'info' | 'warn' | 'error' | 'critical';

export interface ErrorContext {
    userId?: string;
    action?: string;
    path?: string;
    params?: any;
    tags?: string[];
}

export async function logError(
    error: unknown,
    level: LogLevel = 'error',
    context?: ErrorContext
) {
    const timestamp = new Date().toISOString();
    const errorMessage = error instanceof Error ? error.message : String(error);
    const stackTrace = error instanceof Error ? error.stack : undefined;

    // 1. Console Log for Vercel outputs
    if (level === 'critical' || level === 'error') {
        console.error(`[${level.toUpperCase()}] ${errorMessage}`, "\nCONTEXT:", context, "\nSTACK:", stackTrace);
    } else {
        console.warn(`[${level.toUpperCase()}] ${errorMessage}`, "\nCONTEXT:", context);
    }

    // 2. Alert Admin for Critical
    if (level === 'critical') {
        const paramsSafe = JSON.stringify(context?.params || {}).substring(0, 150);
        const notifMsg = `🚨 <b>CRITICAL ERROR (${context?.action || 'Unknown'})</b>\n\n<b>User:</b> ${context?.userId || 'GUEST'}\n<b>Error:</b> ${errorMessage}\n<b>Params:</b> ${paramsSafe}`;
        await sendAdminNotification(notifMsg).catch(console.error);
    }

    // 3. DB Logging (Fire and forget, do not block execution)
    Promise.resolve().then(async () => {
        try {
            const adminSupabase = createAdminClient() as any;
            await adminSupabase.from('error_logs').insert({
                level,
                message: errorMessage,
                stack_trace: stackTrace,
                context: context as any, // stored as jsonb
                user_id: context?.userId || null,
            });
        } catch {
            // Ignore DB log failures so we don't cause a loop
            console.error("Failed to insert into error_logs table.");
        }
    });
}
