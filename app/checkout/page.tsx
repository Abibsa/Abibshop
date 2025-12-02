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
import { ShoppingCart, CreditCard, CheckCircle, ArrowLeft, Trash2, ShieldCheck, Lock, Tag, ChevronRight, Wallet } from "lucide-react"

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
    const [promoCode, setPromoCode] = useState("")
    const [discount, setDiscount] = useState(0)
    const [promoApplied, setPromoApplied] = useState(false)
    const [promoError, setPromoError] = useState("")

    // Payment Details State
    const [cardNumber, setCardNumber] = useState("")
    const [cardExpiry, setCardExpiry] = useState("")
    const [cardCvv, setCardCvv] = useState("")
    const [walletPhone, setWalletPhone] = useState("")

    // Payment Methods Data
    const PAYMENT_METHODS = [
        {
            id: "qris",
            group: "E-Wallet / QRIS",
            name: "QRIS Instant",
            description: "Scan dengan GoPay, OVO, DANA, ShopeePay",
            fee: 0.007, // 0.7%
            feeType: "percent",
            icon: "qr",
            logos: ["QRIS", "GOPAY", "OVO", "DANA"],
            inputType: null
        },
        {
            id: "gopay",
            group: "E-Wallet / QRIS",
            name: "GoPay",
            description: "Sambungkan akun GoPay",
            fee: 0.02, // 2%
            feeType: "percent",
            icon: "wallet",
            logos: ["GOPAY"],
            inputType: "phone"
        },
        {
            id: "ovo",
            group: "E-Wallet / QRIS",
            name: "OVO",
            description: "Push notification ke aplikasi OVO",
            fee: 0.015, // 1.5%
            feeType: "percent",
            icon: "wallet",
            logos: ["OVO"],
            inputType: "phone"
        },
        {
            id: "cc",
            group: "Kartu Kredit / Debit",
            name: "Kartu Kredit / Debit",
            description: "Visa, Mastercard, JCB",
            fee: 0.025, // 2.5%
            feeType: "percent",
            icon: "card",
            logos: ["VISA", "MASTERCARD", "JCB"],
            inputType: "card"
        },
        {
            id: "va_bca",
            group: "Virtual Account",
            name: "BCA Virtual Account",
            description: "Cek otomatis",
            fee: 4500,
            feeType: "fixed",
            icon: "bank",
            logos: ["BCA"],
            inputType: null
        },
        {
            id: "va_mandiri",
            group: "Virtual Account",
            name: "Mandiri Virtual Account",
            description: "Cek otomatis",
            fee: 4500,
            feeType: "fixed",
            icon: "bank",
            logos: ["MANDIRI"],
            inputType: null
        },
        {
            id: "va_bni",
            group: "Virtual Account",
            name: "BNI Virtual Account",
            description: "Cek otomatis",
            fee: 4000,
            feeType: "fixed",
            icon: "bank",
            logos: ["BNI"],
            inputType: null
        },
        {
            id: "va_bri",
            group: "Virtual Account",
            name: "BRI Virtual Account",
            description: "Cek otomatis",
            fee: 4000,
            feeType: "fixed",
            icon: "bank",
            logos: ["BRI"],
            inputType: null
        },
        {
            id: "alfamart",
            group: "Gerai Retail",
            name: "Alfamart",
            description: "Bayar di kasir Alfamart",
            fee: 5000,
            feeType: "fixed",
            icon: "store",
            logos: ["ALFAMART"],
            inputType: null
        },
        {
            id: "indomaret",
            group: "Gerai Retail",
            name: "Indomaret",
            description: "Bayar di kasir Indomaret",
            fee: 5000,
            feeType: "fixed",
            icon: "store",
            logos: ["INDOMARET"],
            inputType: null
        }
    ]

    useEffect(() => {
        setMounted(true)
        if (user) {
            setEmail(user.email)
            setWhatsapp(user.whatsapp || "") // Pre-fill WhatsApp if available
            setWalletPhone(user.whatsapp || "") // Pre-fill phone if available
        }
    }, [user])

    if (!mounted) {
        return null
    }

    const selectedPayment = PAYMENT_METHODS.find(p => p.id === paymentMethod) || PAYMENT_METHODS[0]

    const subtotal = items.reduce((acc, item) => acc + item.price, 0)

    // Calculate Admin Fee
    let adminFee = 0
    if (selectedPayment.feeType === 'percent') {
        adminFee = Math.ceil(subtotal * selectedPayment.fee)
    } else {
        adminFee = selectedPayment.fee
    }

    const serviceFee = 1000 // Base platform fee
    const totalBeforeDiscount = subtotal + serviceFee + adminFee
    const total = totalBeforeDiscount - discount

    // Format Card Number
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').substring(0, 16)
        const formatted = value.match(/.{1,4}/g)?.join(' ') || value
        setCardNumber(formatted)
    }

    // Format Expiry
    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').substring(0, 4)
        if (value.length >= 3) {
            setCardExpiry(`${value.substring(0, 2)}/${value.substring(2)}`)
        } else {
            setCardExpiry(value)
        }
    }

    const handleApplyPromo = () => {
        if (promoCode.toUpperCase() === "HEMAT10") {
            const discAmount = Math.floor(subtotal * 0.1)
            setDiscount(discAmount)
            setPromoApplied(true)
            setPromoError("")
        } else {
            setPromoError("Kode promo tidak valid")
            setDiscount(0)
            setPromoApplied(false)
        }
    }

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
        // Simulasi delay network yang realistis
        await new Promise(resolve => setTimeout(resolve, 2000))

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
                paymentMethod: selectedPayment.name
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
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
                <div className="text-center max-w-md mx-auto">
                    <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <ShoppingCart className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">Keranjang Kosong</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        Sepertinya Anda belum menambahkan produk apapun. Yuk mulai belanja!
                    </p>
                    <Button asChild size="lg" className="gradient-primary w-full shadow-lg hover:shadow-xl transition-all">
                        <Link href="/products">
                            Mulai Belanja
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12">
            {/* Header Steps */}
            <div className="bg-white dark:bg-gray-900 border-b sticky top-0 z-50 shadow-sm">
                <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/products" className="flex items-center text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Lanjut Belanja
                    </Link>
                    <div className="flex items-center gap-2 md:gap-4 text-sm">
                        <div className="flex items-center text-primary font-semibold">
                            <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-2">1</span>
                            <span className="hidden sm:inline">Checkout</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300" />
                        <div className="flex items-center text-gray-400">
                            <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs mr-2">2</span>
                            <span className="hidden sm:inline">Pembayaran</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300" />
                        <div className="flex items-center text-gray-400">
                            <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs mr-2">3</span>
                            <span className="hidden sm:inline">Selesai</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Contact Info */}
                        <Card className="border-0 shadow-md overflow-hidden">
                            <CardHeader className="bg-white dark:bg-gray-900 border-b px-6 py-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    Informasi Kontak
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4 bg-white dark:bg-gray-900">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="contoh@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="bg-gray-50 dark:bg-gray-800"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="whatsapp">WhatsApp Number</Label>
                                        <Input
                                            id="whatsapp"
                                            type="tel"
                                            placeholder="0812xxxx"
                                            value={whatsapp}
                                            onChange={(e) => setWhatsapp(e.target.value)}
                                            className="bg-gray-50 dark:bg-gray-800"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <Lock className="h-3 w-3" />
                                    Data anda aman dan terenkripsi. Kami tidak akan membagikan data anda.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card className="border-0 shadow-md overflow-hidden">
                            <CardHeader className="bg-white dark:bg-gray-900 border-b px-6 py-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <Wallet className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    Metode Pembayaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 bg-white dark:bg-gray-900">
                                <div className="space-y-6">
                                    {/* Group: E-Wallet / QRIS */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">E-Wallet & QRIS</h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {PAYMENT_METHODS.filter(p => p.group === "E-Wallet / QRIS").map((method) => (
                                                <div
                                                    key={method.id}
                                                    onClick={() => setPaymentMethod(method.id)}
                                                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 ${paymentMethod === method.id ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-blue-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center flex-shrink-0 ${paymentMethod === method.id ? 'border-blue-600' : 'border-gray-300'}`}>
                                                            {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <span className="font-semibold text-base">{method.name}</span>
                                                                {method.id === 'qris' && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">INSTANT</span>}
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1 mb-3">{method.description}</p>
                                                            <div className="flex flex-wrap gap-2 mb-2">
                                                                {method.logos.map((logo, idx) => (
                                                                    <span key={idx} className={`
                                                                        text-[10px] font-bold px-2 py-1 rounded border
                                                                        ${logo === 'GOPAY' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
                                                                        ${logo === 'OVO' ? 'bg-purple-50 text-purple-600 border-purple-200' : ''}
                                                                        ${logo === 'DANA' ? 'bg-sky-50 text-sky-600 border-sky-200' : ''}
                                                                        ${logo === 'QRIS' ? 'bg-white text-gray-800 border-gray-300' : ''}
                                                                    `}>
                                                                        {logo}
                                                                    </span>
                                                                ))}
                                                            </div>

                                                            {/* Input for E-Wallet Phone */}
                                                            {paymentMethod === method.id && method.inputType === 'phone' && (
                                                                <div className="mt-4 pt-4 border-t animate-slide-up" onClick={(e) => e.stopPropagation()}>
                                                                    <Label className="text-xs mb-1.5 block">Nomor HP Terdaftar</Label>
                                                                    <Input
                                                                        placeholder="0812xxxx"
                                                                        value={walletPhone}
                                                                        onChange={(e) => setWalletPhone(e.target.value)}
                                                                        className="h-9 bg-white dark:bg-gray-950"
                                                                    />
                                                                    <p className="text-[10px] text-gray-500 mt-1">Kami akan mengirimkan permintaan pembayaran ke nomor ini.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Group: Credit Card */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Kartu Kredit / Debit</h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {PAYMENT_METHODS.filter(p => p.group === "Kartu Kredit / Debit").map((method) => (
                                                <div
                                                    key={method.id}
                                                    onClick={() => setPaymentMethod(method.id)}
                                                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 ${paymentMethod === method.id ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-blue-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center flex-shrink-0 ${paymentMethod === method.id ? 'border-blue-600' : 'border-gray-300'}`}>
                                                            {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <span className="font-semibold text-base">{method.name}</span>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1 mb-3">{method.description}</p>
                                                            <div className="flex flex-wrap gap-2 mb-2">
                                                                {method.logos.map((logo, idx) => (
                                                                    <span key={idx} className="text-[10px] font-bold px-2 py-1 rounded border bg-white text-gray-800 border-gray-300">
                                                                        {logo}
                                                                    </span>
                                                                ))}
                                                            </div>

                                                            {/* Input for Credit Card */}
                                                            {paymentMethod === method.id && method.inputType === 'card' && (
                                                                <div className="mt-4 pt-4 border-t animate-slide-up space-y-3" onClick={(e) => e.stopPropagation()}>
                                                                    <div className="space-y-1.5">
                                                                        <Label className="text-xs">Nomor Kartu</Label>
                                                                        <div className="relative">
                                                                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                                            <Input
                                                                                placeholder="0000 0000 0000 0000"
                                                                                value={cardNumber}
                                                                                onChange={handleCardNumberChange}
                                                                                className="h-9 pl-9 bg-white dark:bg-gray-950 font-mono"
                                                                                maxLength={19}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        <div className="space-y-1.5">
                                                                            <Label className="text-xs">Masa Berlaku</Label>
                                                                            <Input
                                                                                placeholder="MM/YY"
                                                                                value={cardExpiry}
                                                                                onChange={handleExpiryChange}
                                                                                className="h-9 bg-white dark:bg-gray-950 font-mono"
                                                                                maxLength={5}
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-1.5">
                                                                            <Label className="text-xs">CVV</Label>
                                                                            <div className="relative">
                                                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                                                                                <Input
                                                                                    placeholder="123"
                                                                                    value={cardCvv}
                                                                                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                                                                                    className="h-9 pl-8 bg-white dark:bg-gray-950 font-mono"
                                                                                    type="password"
                                                                                    maxLength={3}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Group: Virtual Account */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Virtual Account</h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {PAYMENT_METHODS.filter(p => p.group === "Virtual Account").map((method) => (
                                                <div
                                                    key={method.id}
                                                    onClick={() => setPaymentMethod(method.id)}
                                                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 ${paymentMethod === method.id ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-blue-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === method.id ? 'border-blue-600' : 'border-gray-300'}`}>
                                                            {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                                                        </div>
                                                        <div className="flex-1 flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`
                                                                    w-10 h-6 rounded flex items-center justify-center text-[9px] font-bold text-white
                                                                    ${method.logos[0] === 'BCA' ? 'bg-[#005EB8]' : ''}
                                                                    ${method.logos[0] === 'MANDIRI' ? 'bg-[#FFB700] text-[#003D79]' : ''}
                                                                    ${method.logos[0] === 'BNI' ? 'bg-[#F15A23]' : ''}
                                                                    ${method.logos[0] === 'BRI' ? 'bg-[#00529C]' : ''}
                                                                `}>
                                                                    {method.logos[0]}
                                                                </div>
                                                                <span className="font-semibold text-sm">{method.name}</span>
                                                            </div>
                                                            <span className="text-xs text-gray-500">
                                                                + Rp {method.fee.toLocaleString("id-ID")}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Group: Retail */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Gerai Retail</h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {PAYMENT_METHODS.filter(p => p.group === "Gerai Retail").map((method) => (
                                                <div
                                                    key={method.id}
                                                    onClick={() => setPaymentMethod(method.id)}
                                                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 ${paymentMethod === method.id ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-blue-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === method.id ? 'border-blue-600' : 'border-gray-300'}`}>
                                                            {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                                                        </div>
                                                        <div className="flex-1 flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`
                                                                    w-12 h-6 rounded flex items-center justify-center text-[8px] font-bold
                                                                    ${method.logos[0] === 'ALFAMART' ? 'bg-[#DA291C] text-white' : ''}
                                                                    ${method.logos[0] === 'INDOMARET' ? 'bg-[#005EB8] text-white border-b-4 border-[#DA291C]' : ''}
                                                                `}>
                                                                    {method.logos[0]}
                                                                </div>
                                                                <span className="font-semibold text-sm">{method.name}</span>
                                                            </div>
                                                            <span className="text-xs text-gray-500">
                                                                + Rp {method.fee.toLocaleString("id-ID")}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="sticky top-24 space-y-6">
                            <Card className="border-0 shadow-lg overflow-hidden">
                                <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b px-6 py-4">
                                    <CardTitle className="text-lg">Ringkasan Pesanan</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 bg-white dark:bg-gray-900">
                                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {items.map((item, index) => (
                                            <div key={index} className="flex gap-3 py-2 border-b last:border-0 border-dashed">
                                                <div className="h-12 w-12 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                                    <Tag className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{item.productName}</p>
                                                    <p className="text-xs text-gray-500 truncate">User: {item.username}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-sm">Rp {item.price.toLocaleString("id-ID")}</p>
                                                    <button
                                                        onClick={() => removeItem(item.productId)}
                                                        className="text-[10px] text-red-500 hover:underline mt-1"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Promo Code */}
                                    <div className="mt-6 pt-6 border-t">
                                        <Label className="text-xs mb-2 block">Kode Promo</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Masukan kode"
                                                className="h-9 text-sm uppercase"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                            />
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={handleApplyPromo}
                                                className="h-9"
                                            >
                                                Pakai
                                            </Button>
                                        </div>
                                        {promoError && <p className="text-xs text-red-500 mt-1">{promoError}</p>}
                                        {promoApplied && <p className="text-xs text-green-600 mt-1">Kode promo berhasil digunakan!</p>}
                                    </div>

                                    {/* Cost Breakdown */}
                                    <div className="mt-6 space-y-2 pt-6 border-t">
                                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                            <span>Subtotal</span>
                                            <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                            <span>Biaya Layanan</span>
                                            <span>Rp {serviceFee.toLocaleString("id-ID")}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                            <span>Biaya Admin ({selectedPayment.name})</span>
                                            <span>Rp {adminFee.toLocaleString("id-ID")}</span>
                                        </div>
                                        {promoApplied && (
                                            <div className="flex justify-between text-sm text-green-600 font-medium">
                                                <span>Diskon</span>
                                                <span>-Rp {discount.toLocaleString("id-ID")}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-lg font-bold pt-4 border-t mt-4">
                                            <span>Total</span>
                                            <span className="text-primary">Rp {total.toLocaleString("id-ID")}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t">
                                    <Button
                                        size="lg"
                                        className="w-full gradient-primary shadow-lg hover:shadow-xl transition-all h-12 text-base"
                                        onClick={handlePayment}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                                Memproses...
                                            </>
                                        ) : (
                                            <>
                                                Bayar Sekarang
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>

                            <div className="flex items-center justify-center gap-4 text-gray-400 grayscale opacity-70">
                                {/* Simple text placeholders for trust signals if images aren't available */}
                                <div className="flex flex-col items-center">
                                    <ShieldCheck className="h-6 w-6 mb-1" />
                                    <span className="text-[10px]">Secure</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <CheckCircle className="h-6 w-6 mb-1" />
                                    <span className="text-[10px]">Verified</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Lock className="h-6 w-6 mb-1" />
                                    <span className="text-[10px]">Encrypted</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
