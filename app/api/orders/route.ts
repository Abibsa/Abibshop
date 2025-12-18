import { NextRequest, NextResponse } from 'next/server'
import { orderService } from '@/services/order.service'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const status = searchParams.get('status') || undefined
        const paymentStatus = searchParams.get('payment_status') || undefined
        const userId = searchParams.get('user_id') || undefined
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
        const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined

        const result = await orderService.getOrders({
            status,
            paymentStatus,
            userId,
            limit,
            offset,
        })

        return NextResponse.json({
            success: true,
            data: result.orders,
            total: result.total,
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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const order = await orderService.createOrder(body)

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
