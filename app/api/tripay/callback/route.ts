import { NextRequest, NextResponse } from 'next/server';
import { TripayService } from '@/lib/tripay';
import { createAdminClient } from '@/lib/supabase/admin';
import { logError } from '@/lib/error-handler';
import { sendAdminNotification } from '@/lib/notifier';

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-callback-signature');

        if (!signature || !TripayService.verifyWebhookSignature(rawBody, signature)) {
            return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
        }

        const callback = JSON.parse(rawBody);
        const merchantRef = callback.merchant_ref;
        const reference = callback.reference;
        const status = callback.status; // 'PAID', 'EXPIRED', 'FAILED'

        const adminSupabase = createAdminClient() as any;

        if (status === 'PAID') {
            // 1. Update all orders with this merchant prefix/ref
            // Since we used the first order ID as merchant_ref, we search for orders with that tripay_reference
            const { data: updatedOrders, error: updateError } = await adminSupabase
                .from('orders')
                .update({
                    payment_status: 'paid',
                    status: 'processing', // Move to processing after payment
                    updated_at: new Date().toISOString()
                })
                .eq('tripay_reference', reference)
                .select();

            if (updateError) throw updateError;

            // 2. Log Payment Success
            await sendAdminNotification(`💰 <b>PAYMENT SUCCESS</b>\nRef: ${reference}\nMerchant Ref: ${merchantRef}\nStatus: PAID`);

            // 3. Optional: Trigger specific game logic here via service-role
        } else if (status === 'EXPIRED' || status === 'FAILED') {
            await adminSupabase
                .from('orders')
                .update({
                    payment_status: status.toLowerCase(),
                    status: 'failed',
                    updated_at: new Date().toISOString()
                })
                .eq('tripay_reference', reference);

            // Restore stock if needed? (Depends on business logic)
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        await logError(error, 'critical', { action: 'tripay_callback' });
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
