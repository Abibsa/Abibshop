"use client"

import { useCartStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth-store"
import { useOrderStore } from "@/lib/order-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ShoppingCart, CreditCard, CheckCircle, ArrowLeft, Trash2 } from "lucide-react"

export default function CheckoutPage() {
    const { items, clearCart, removeItem } = useCartStore()
    const { user } = useAuthStore()
    const { addOrder } = useOrderStore()
    const router = useRouter()
    const [paymentMethod, setPaymentMethod] = useState("qris")
    const [whatsapp, setWhatsapp] = useState("")
    const [email, setEmail] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (user) {
            setEmail(user.email)
        }
    }, [user])

    if (!mounted) {
        return null
    }

    const total = items.reduce((acc, item) => acc + item.price, 0)

    const handlePayment = async () => {
        if (!whatsapp) {
            alert("Mohon isi nomor WhatsApp untuk konfirmasi!")
            return
        }

        if (!email) {
            alert("Mohon isi email!")
            return
        }

        setIsProcessing(true)
        await new Promise(resolve => setTimeout(resolve, 1000))

        const newOrderIds: string[] = []
        items.forEach(item => {
            const newId = addOrder({
                customerId: user?.id || 'guest',
                customerName: user?.name || 'Guest',
                customerEmail: email,
                whatsapp: whatsapp,
                productId: item.productId,
                productName: item.productName,
                amount: item.price,
                status: 'pending',
                robloxUsername: item.username,
                paymentMethod: paymentMethod === 'qris' ? 'QRIS' : 'Bank Transfer'
            })
            newOrderIds.push(newId)
        })

        setIsProcessing(false)
        clearCart()

        const orderIdsParam = newOrderIds.join(',')
        router.push(`/checkout/success?orderIds=${encodeURIComponent(orderIdsParam)}`)
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center max-w-md mx-auto">
                    <div className="mb-4 md:mb-6 inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted">
                        <ShoppingCart className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
                    </div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">Keranjang Kosong</h1>
                    <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">Belum ada produk di keranjang Anda</p>
                    <Button asChild size="lg" className="gradient-primary h-10 md:h-11 text-sm md:text-base">
                        <Link href="/products">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Belanja Sekarang
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-6 md:pb-0">
            {/* Header */}
            <section className="relative py-4 md:py-8 overflow-hidden border-b">
                <div className="absolute inset-0 gradient-mesh opacity-20" />
                <div className="container relative z-10 px-3 md:px-6">
                    <Button variant="ghost" asChild className="mb-2 md:mb-4 h-8 md:h-10 text-xs md:text-sm -ml-2 md:ml-0">
                        <Link href="/products">
                            <ArrowLeft className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                            Kembali
                        </Link>
                    </Button>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Checkout
                    </h1>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">Selesaikan pembayaran Anda</p>
                </div>
            </section>

            <div className="container py-4 md:py-10 px-3 md:px-6 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                    {/* Order Summary */}
                    <div className="space-y-3 md:space-y-6">
                        <Card className="border-2 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-b px-3 md:px-6 py-3 md:py-6">
                                <CardTitle className="flex items-center gap-1.5 md:gap-2 text-base md:text-lg">
                                    <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                                    Ringkasan Pesanan
                                </CardTitle>
                                <CardDescription className="text-xs md:text-sm">
                                    {items.length} item di keranjang
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 md:space-y-4 pt-4 md:pt-6 px-3 md:px-6">
                                {items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-start border-b pb-3 md:pb-4 last:border-0 last:pb-0 gap-2 md:gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm md:text-base truncate">{item.productName}</p>
                                            <p className="text-xs md:text-sm text-muted-foreground truncate">
                                                Username: <span className="font-mono text-primary">{item.username}</span>
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 md:gap-2 flex-shrink-0">
                                            <p className="font-bold text-primary text-sm md:text-base whitespace-nowrap">
                                                Rp {item.price.toLocaleString("id-ID")}
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 md:h-8 md:w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                                onClick={() => removeItem(item.productId)}
                                            >
                                                <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center pt-3 md:pt-4 border-t-2">
                                    <span className="text-sm md:text-lg font-semibold">Total Pembayaran</span>
                                    <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Rp {total.toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Info Card */}
                        <Card className="border-2 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                            <CardContent className="pt-4 md:pt-6 px-3 md:px-6 pb-4 md:pb-6">
                                <div className="flex items-start gap-2 md:gap-3">
                                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-xs md:text-sm text-blue-900 dark:text-blue-100">
                                        <p className="font-semibold mb-1">Proses Aman & Terpercaya</p>
                                        <ul className="space-y-0.5 md:space-y-1 text-[10px] md:text-xs">
                                            <li>✓ Pembayaran terenkripsi</li>
                                            <li>✓ Proses otomatis 10-30 menit</li>
                                            <li>✓ Customer service 24/7</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Payment Form */}
                    <div className="space-y-3 md:space-y-6">
                        <Card className="border-2 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-b px-3 md:px-6 py-3 md:py-6">
                                <CardTitle className="flex items-center gap-1.5 md:gap-2 text-base md:text-lg">
                                    <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                                    Data Pembayaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 md:space-y-6 pt-4 md:pt-6 px-3 md:px-6">
                                <div className="space-y-1.5 md:space-y-2">
                                    <Label htmlFor="email" className="text-xs md:text-sm">
                                        Email <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-9 md:h-12 text-sm md:text-base"
                                    />
                                    <p className="text-[10px] md:text-xs text-muted-foreground">
                                        Konfirmasi pesanan akan dikirim ke email ini
                                    </p>
                                </div>

                                <div className="space-y-1.5 md:space-y-2">
                                    <Label htmlFor="whatsapp" className="text-xs md:text-sm">
                                        Nomor WhatsApp <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="whatsapp"
                                        placeholder="0812xxxx"
                                        value={whatsapp}
                                        onChange={(e) => setWhatsapp(e.target.value)}
                                        type="tel"
                                        className="h-9 md:h-12 text-sm md:text-base"
                                    />
                                    <p className="text-[10px] md:text-xs text-muted-foreground">
                                        Bukti pembayaran akan dikirim ke sini
                                    </p>
                                </div>

                                <div className="space-y-2 md:space-y-3">
                                    <Label className="text-xs md:text-sm">Metode Pembayaran</Label>
                                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                                        <div className="flex items-center space-x-2 md:space-x-3 border-2 p-3 md:p-4 rounded-lg hover:border-primary transition-colors cursor-pointer">
                                            <RadioGroupItem value="qris" id="qris" className="h-4 w-4 md:h-5 md:w-5" />
                                            <Label htmlFor="qris" className="flex-1 cursor-pointer">
                                                <div className="font-semibold text-xs md:text-sm">QRIS</div>
                                                <div className="text-[10px] md:text-xs text-muted-foreground">OVO, DANA, GoPay, ShopeePay</div>
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 md:space-x-3 border-2 p-3 md:p-4 rounded-lg hover:border-primary transition-colors cursor-pointer">
                                            <RadioGroupItem value="manual" id="manual" className="h-4 w-4 md:h-5 md:w-5" />
                                            <Label htmlFor="manual" className="flex-1 cursor-pointer">
                                                <div className="font-semibold text-xs md:text-sm">Transfer Bank</div>
                                                <div className="text-[10px] md:text-xs text-muted-foreground">BCA, Mandiri, BNI, BRI</div>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-2 md:gap-3 px-3 md:px-6 pb-3 md:pb-6">
                                <Button
                                    size="lg"
                                    className="w-full h-10 md:h-12 text-xs md:text-base gradient-primary"
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white mr-2" />
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="mr-1.5 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
                                            <span className="hidden sm:inline">Bayar Sekarang - </span>
                                            Rp {total.toLocaleString("id-ID")}
                                        </>
                                    )}
                                </Button>
                                <p className="text-[10px] md:text-xs text-center text-muted-foreground">
                                    Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami
                                </p>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
