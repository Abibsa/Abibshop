"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function simulatePayment(orderNumber: string) {
    const adminSupabase = createAdminClient() as any;

    const { data, error } = await adminSupabase
        .from('orders')
        .update({
            payment_status: 'paid',
            status: 'processing',
            updated_at: new Date().toISOString()
        })
        .eq('order_number', orderNumber)
        .select();

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath(`/order/${orderNumber}`);
    return { success: true };
}
