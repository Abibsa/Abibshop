import crypto from 'crypto';

const MERCHANT_CODE = process.env.DUITKU_MERCHANT_CODE || '';
const API_KEY = process.env.DUITKU_API_KEY || '';
const BASE_URL = process.env.DUITKU_BASE_URL || 'https://sandbox.duitku.com/webapi';

export class DuitkuService {
    /**
     * Generates MD5 signature for Duitku request
     */
    private static createSignature(merchantRef: string, amount: number) {
        const stringToHash = MERCHANT_CODE + merchantRef + amount + API_KEY;
        return crypto.createHash('md5').update(stringToHash).digest('hex');
    }

    /**
     * Request Transaction (Create Invoice)
     */
    static async createInvoice(params: {
        paymentMethod: string;
        merchantOrderId: string;
        amount: number;
        productDetails: string;
        customerVaName: string;
        email: string;
        phoneNumber: string;
        itemDetails: { name: string, price: number, quantity: number }[];
    }) {
        const signature = this.createSignature(params.merchantOrderId, params.amount);

        const body = {
            merchantCode: MERCHANT_CODE,
            paymentAmount: params.amount,
            paymentMethod: params.paymentMethod,
            merchantOrderId: params.merchantOrderId,
            productDetails: params.productDetails,
            additionalParam: '',
            merchantUserInfo: params.customerVaName,
            customerVaName: params.customerVaName,
            email: params.email,
            phoneNumber: params.phoneNumber,
            itemDetails: params.itemDetails,
            callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/duitku/callback`,
            returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/tracking`,
            expiryPeriod: 1440, // 24 hours
            signature: signature
        };

        try {
            const response = await fetch(`${BASE_URL}/v2/createInvoice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (result.statusCode !== '00') {
                throw new Error(result.statusMessage || 'Duitku invoice creation failed');
            }

            return result; // contains paymentUrl, merchantOrderId, reference
        } catch (error) {
            console.error('Duitku createInvoice error:', error);
            throw error;
        }
    }

    /**
     * Verify Callback Signature
     */
    static verifyCallbackSignature(params: {
        merchantCode: string;
        amount: string;
        merchantOrderId: string;
        signature: string;
    }) {
        const stringToHash = MERCHANT_CODE + params.amount + params.merchantOrderId + API_KEY;
        const localSignature = crypto.createHash('md5').update(stringToHash).digest('hex');
        return localSignature === params.signature;
    }
}
