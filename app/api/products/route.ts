import { NextRequest, NextResponse } from 'next/server'
import { productService } from '@/services/product.service'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const category = searchParams.get('category') || undefined
        const featured = searchParams.get('featured') === 'true' ? true : undefined
        const search = searchParams.get('search') || undefined

        const products = await productService.getProducts({
            category,
            featured,
            search,
        })

        return NextResponse.json({
            success: true,
            data: products,
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
        const product = await productService.createProduct(body)

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
