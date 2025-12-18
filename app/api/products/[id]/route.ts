import { NextRequest, NextResponse } from 'next/server'
import { productService } from '@/services/product.service'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const product = await productService.getProductById(id)

        return NextResponse.json({
            success: true,
            data: product,
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

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const product = await productService.updateProduct(id, body)

        return NextResponse.json({
            success: true,
            data: product,
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

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await productService.deleteProduct(id)

        return NextResponse.json({
            success: true,
            message: 'Product deleted successfully',
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
