import crypto from 'crypto';

const TRIPAY_API_KEY = process.env.TRIPAY_API_KEY || '';
const TRIPAY_PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY || '';
const TRIPAY_MERCHANT_CODE = process.env.TRIPAY_MERCHANT_CODE || '';
const TRIPAY_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://tripay.co.id/api'
    : 'https://tripay.co.id/api-sandbox';

export interface TripayPaymentMethod {
    code: string;
    name: string;
    group: string;
    fee_merchant: { flat: number; percent: number };
    fee_customer: { flat: number; percent: number };
    total_fee: { flat: number; percent: number };
    minimum_fee: number;
    maximum_fee: number;
    icon_url: string;
}

export class TripayService {
    /**
     * Create Signature for Request
     */
    private static createSignature(merchantRef: string, amount: number) {
        return crypto
            .createHmac('sha256', TRIPAY_PRIVATE_KEY)
            .update(TRIPAY_MERCHANT_CODE + merchantRef + amount)
            .digest('hex');
    }

    /**
     * Get Payment Methods
     */
    static async getPaymentMethods() {
        try {
            const response = await fetch(`${TRIPAY_BASE_URL}/merchant/payment-channel`, {
                headers: { Authorization: `Bearer ${TRIPAY_API_KEY}` },
            });
            const result = await response.json();
            return result.data as TripayPaymentMethod[];
        } catch (error) {
            console.error('Tripay getPaymentMethods error:', error);
            return [];
        }
    }

    /**
     * Request Transaction (Closed Payment)
     */
    static async createTransaction(params: {
        method: string;
        merchant_ref: string;
        amount: number;
        customer_name: string;
        customer_email: string;
        customer_phone: string;
        order_items: { sku: string; name: string; price: number; quantity: number }[];
    }) {
        const signature = this.createSignature(params.merchant_ref, params.amount);

        const body = {
            method: params.method,
            merchant_ref: params.merchant_ref,
            amount: params.amount,
            customer_name: params.customer_name,
            customer_email: params.customer_email,
            customer_phone: params.customer_phone,
            order_items: params.order_items,
            callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/tripay/callback`,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/${params.merchant_ref}`,
            expired_time: Math.floor(Date.now() / 1000) + 24 * 3600, // 24 hours
            signature,
        };

        try {
            const response = await fetch(`${TRIPAY_BASE_URL}/transaction/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${TRIPAY_API_KEY}`,
                },
                body: JSON.stringify(body),
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'Tripay creation failed');
            }
            return result.data;
        } catch (error) {
            console.error('Tripay createTransaction error:', error);
            throw error;
        }
    }

    /**
     * Verify Webhook Signature
     */
    static verifyWebhookSignature(jsonBody: string, signature: string) {
        const localSignature = crypto
            .createHmac('sha256', TRIPAY_PRIVATE_KEY)
            .update(jsonBody)
            .digest('hex');
        return localSignature === signature;
    }
}
