"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, AlertCircle, Package, CreditCard, Sparkles } from "lucide-react"
import Link from "next/link"

export default function OrderStatusPage() {
    const params = useParams()
    const orderId = params.id

    // Mock status - in real app, fetch from API
    const status = "pending" // pending, paid, processing, completed

    const statusConfig = {
        pending: {
            icon: <Clock className="h-12 w-12" />,
            title: "Menunggu Pembayaran",
            color: "text-yellow-600",
            bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
            gradient: "from-yellow-500 to-orange-500"
        },
        paid: {
            icon: <CreditCard className="h-12 w-12" />,
            title: "Pembayaran Diterima",
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
            gradient: "from-blue-500 to-cyan-500"
        },
        processing: {
            icon: <Package className="h-12 w-12" />,
            title: "Sedang Diproses",
            color: "text-purple-600",
            bgColor: "bg-purple-100 dark:bg-purple-900/20",
            gradient: "from-purple-500 to-pink-500"
        },
        completed: {
            icon: <CheckCircle className="h-12 w-12" />,
            title: "Pesanan Selesai",
            color: "text-green-600",
            bgColor: "bg-green-100 dark:bg-green-900/20",
            gradient: "from-green-500 to-emerald-500"
        }
    }

    const currentStatus = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending

    return (
        <div className="relative min-h-[calc(100vh-200px)] py-10 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 gradient-mesh opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />

            <div className="container relative z-10 px-4 max-w-3xl">
                <Card className="border-2 shadow-2xl hover-lift animate-scale-in">
                    <CardHeader className="text-center space-y-4 pb-8">
                        <div className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-br ${currentStatus.gradient} flex items-center justify-center shadow-lg text-white animate-float`}>
                            {currentStatus.icon}
                        </div>
                        <div>
                            <CardTitle className="text-2xl md:text-3xl font-bold">{currentStatus.title}</CardTitle>
                            <CardDescription className="text-base mt-2">
                                Order ID: <span className="font-mono font-semibold">{orderId}</span>
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Payment Instructions */}
                        <div className={`p-6 rounded-lg border-2 ${currentStatus.bgColor}`}>
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Instruksi Pembayaran
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Silakan scan QRIS di bawah ini atau transfer ke rekening berikut:
                            </p>

                            {/* QRIS Placeholder */}
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border-2 flex justify-center mb-4 hover-lift">
                                <div className="h-48 w-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center text-gray-500 shadow-inner">
                                    <div className="text-center">
                                        <Package className="h-16 w-16 mx-auto mb-2 opacity-50" />
                                        <p className="text-xs">QRIS CODE</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg border">
                                <p className="text-sm font-semibold mb-1">Total Pembayaran:</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Rp 50.000
                                </p>
                            </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Status Pesanan</h3>
                            <div className="space-y-3">
                                {[
                                    { label: "Pesanan Dibuat", done: true },
                                    { label: "Menunggu Pembayaran", done: status !== "pending" },
                                    { label: "Pembayaran Dikonfirmasi", done: (status as string) === "processing" || (status as string) === "completed" },
                                    { label: "Pesanan Diproses", done: (status as string) === "completed" },
                                    { label: "Selesai", done: (status as string) === "completed" }
                                ].map((step, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.done
                                            ? `bg-gradient-to-br ${currentStatus.gradient} text-white`
                                            : "bg-muted text-muted-foreground"
                                            }`}>
                                            {step.done ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                        </div>
                                        <span className={step.done ? "font-medium" : "text-muted-foreground"}>{step.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-4">
                            <Button className="w-full gradient-primary hover:opacity-90 transition-opacity">
                                <CreditCard className="mr-2 h-4 w-4" />
                                Upload Bukti Transfer
                            </Button>
                            <Button variant="outline" className="w-full hover-lift">
                                <Package className="mr-2 h-4 w-4" />
                                Cek Status Pembayaran
                            </Button>
                        </div>
                    </CardContent>

                    <CardFooter className="justify-center border-t pt-6">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">
                                Butuh bantuan?
                            </p>
                            <Button variant="link" asChild className="text-primary">
                                <Link href="https://wa.me/6281234567890" target="_blank">
                                    Hubungi WhatsApp Admin
                                </Link>
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
