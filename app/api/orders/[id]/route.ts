import { NextRequest, NextResponse } from 'next/server'
import { orderService } from '@/services/order.service'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const order = await orderService.getOrderById(id)

        return NextResponse.json({
            success: true,
            data: order,
        })
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message,
            },
            { status: 404 }
        )
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()

        let order
        if (body.status) {
            order = await orderService.updateOrderStatus(id, body.status, body.notes)
        } else if (body.payment_status) {
            order = await orderService.updatePaymentStatus(id, body.payment_status)
        } else {
            throw new Error('No valid update field provided')
        }

        return NextResponse.json({
            success: true,
            data: order,
        })
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message,
            },
            { status: 500 }
        )
    }
}
