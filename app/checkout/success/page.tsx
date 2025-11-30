"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, Copy, ArrowRight, Package } from "lucide-react"
import Link from "next/link"

function CheckoutSuccessContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [orderIds, setOrderIds] = useState<string[]>([])
    const [copiedId, setCopiedId] = useState<string | null>(null)

    useEffect(() => {
        const ids = searchParams.get('orderIds')
        if (ids) {
            setOrderIds(ids.split(','))
        } else {
            router.push('/')
        }
    }, [searchParams, router])

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(text)
        setTimeout(() => setCopiedId(null), 2000)
    }

    if (orderIds.length === 0) {
        return null
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 p-3 md:p-4">
            <div className="w-full max-w-2xl">
                <Card className="border-2 shadow-2xl">
                    <CardHeader className="text-center pb-4 md:pb-8 pt-6 md:pt-10 px-3 md:px-6">
                        <div className="mx-auto mb-3 md:mb-6 w-14 h-14 md:w-20 md:h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 md:h-12 md:w-12 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent px-2">
                            Pesanan Berhasil! 🎉
                        </CardTitle>
                        <CardDescription className="text-xs md:text-base px-2">
                            Terima kasih telah berbelanja di AbibShop
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 md:space-y-6 pb-6 md:pb-10 px-3 md:px-6">
                        <div className="bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-3 md:p-6">
                            <div className="flex items-start gap-2 md:gap-3 mb-2 md:mb-4">
                                <Package className="h-4 w-4 md:h-5 md:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-xs md:text-base text-blue-900 dark:text-blue-100 mb-0.5 md:mb-1">
                                        Order ID Anda
                                    </h3>
                                    <p className="text-[10px] md:text-sm text-blue-700 dark:text-blue-300 leading-tight md:leading-normal">
                                        Simpan Order ID untuk tracking
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 md:space-y-3">
                                {orderIds.map((orderId, index) => (
                                    <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-2.5 md:p-4 border-2 border-blue-100 dark:border-blue-900">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] md:text-xs text-muted-foreground mb-0.5 md:mb-1">
                                                    Order #{index + 1}
                                                </p>
                                                <p className="font-mono font-bold text-xs md:text-base lg:text-lg text-primary break-all leading-tight">
                                                    {orderId}
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10"
                                                onClick={() => copyToClipboard(orderId)}
                                            >
                                                {copiedId === orderId ? (
                                                    <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600" />
                                                ) : (
                                                    <Copy className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg p-3 md:p-4">
                            <h4 className="font-semibold text-xs md:text-base text-yellow-900 dark:text-yellow-100 mb-1.5 md:mb-2 flex items-center gap-1.5 md:gap-2">
                                <span className="text-sm md:text-base">⚠️</span>
                                <span>Langkah Selanjutnya</span>
                            </h4>
                            <ol className="text-[10px] md:text-sm text-yellow-800 dark:text-yellow-200 space-y-1 md:space-y-2 ml-4 md:ml-6 list-decimal leading-tight md:leading-normal">
                                <li>Simpan Order ID (screenshot/salin)</li>
                                <li>Lakukan pembayaran</li>
                                <li>Tunggu konfirmasi (10-30 menit)</li>
                                <li>Cek status dengan Order ID</li>
                                <li>Kode redeem muncul saat selesai</li>
                            </ol>
                        </div>

                        <div className="flex flex-col gap-2 md:gap-3 pt-1 md:pt-4">
                            <Button
                                asChild
                                size="lg"
                                className="w-full gradient-primary h-10 md:h-12 text-xs md:text-base"
                            >
                                <Link href="/tracking" className="flex items-center justify-center">
                                    <Package className="mr-1.5 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
                                    <span>Cek Status Pesanan</span>
                                    <ArrowRight className="ml-1.5 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="w-full h-10 md:h-12 text-xs md:text-base"
                            >
                                <Link href="/products">
                                    Belanja Lagi
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        }>
            <CheckoutSuccessContent />
        </Suspense>
    )
}
