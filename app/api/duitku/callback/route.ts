import { NextRequest, NextResponse } from 'next/server';
import { DuitkuService } from '@/lib/duitku';
import { createAdminClient } from '@/lib/supabase/admin';
import { logError } from '@/lib/error-handler';
import { sendAdminNotification } from '@/lib/notifier';

export async function POST(req: NextRequest) {
    try {
        // Duitku sends callback as form-data / urlencoded
        const formData = await req.formData();
        const result: any = {};
        formData.forEach((value, key) => { result[key] = value });

        const { merchantCode, amount, merchantOrderId, signature, resultCode, reference } = result;

        // 1. Verify Signature
        if (!DuitkuService.verifyCallbackSignature({ merchantCode, amount, merchantOrderId, signature })) {
            return NextResponse.json({ success: false, message: 'Invalid Signature' }, { status: 400 });
        }

        const adminSupabase = createAdminClient() as any;

        // 2. Jika Sukses (resultCode 00 = Success)
        if (resultCode === '00') {
            await adminSupabase
                .from('orders')
                .update({
                    payment_status: 'paid',
                    status: 'processing',
                    updated_at: new Date().toISOString()
                })
                .eq('order_number', merchantOrderId);

            await sendAdminNotification(`💰 <b>DUITKU PAID</b>\nOrder: ${merchantOrderId}\nTotal: Rp ${Number(amount).toLocaleString()}\nMethod: ${result.paymentCode}`);
        } else {
            await adminSupabase
                .from('orders')
                .update({
                    payment_status: 'failed',
                    status: 'failed',
                })
                .eq('order_number', merchantOrderId);
        }

        return new Response('OK', { status: 200 }); // Duitku expects string "OK"
    } catch (error: any) {
        await logError(error, 'critical', { action: 'duitku_callback' });
        return new Response('Error', { status: 500 });
    }
}
