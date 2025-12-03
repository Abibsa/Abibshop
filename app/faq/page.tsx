"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, MessageCircle, ShoppingCart, Shield, CreditCard } from "lucide-react"

export default function FAQPage() {
    const faqs = [
        {
            category: "Umum",
            icon: <HelpCircle className="h-5 w-5 text-primary" />,
            items: [
                {
                    question: "Apa itu AbibShop?",
                    answer: "AbibShop adalah platform top up game Roblox terpercaya yang menyediakan layanan pembelian Robux, Gamepass, dan Joki Level dengan harga terjangkau dan proses yang cepat."
                },
                {
                    question: "Apakah AbibShop aman?",
                    answer: "Ya, 100% aman. Kami menggunakan metode legal untuk semua transaksi dan menjamin keamanan akun pelanggan. Kami juga memiliki ribuan testimoni positif dari pelanggan."
                },
                {
                    question: "Bagaimana cara menghubungi CS?",
                    answer: "Anda dapat menghubungi Customer Service kami melalui WhatsApp di nomor yang tertera di website atau melalui email support@abibshop.com. Layanan CS aktif pukul 09:00 - 22:00 WIB."
                }
            ]
        },
        {
            category: "Pesanan & Pembayaran",
            icon: <ShoppingCart className="h-5 w-5 text-primary" />,
            items: [
                {
                    question: "Berapa lama proses pesanan?",
                    answer: "Proses pesanan bervariasi tergantung jenis layanan. Untuk Robux via Login biasanya 10-30 menit. Untuk Joki Level tergantung target level. Estimasi waktu akan diinformasikan saat pemesanan."
                },
                {
                    question: "Metode pembayaran apa saja yang tersedia?",
                    answer: "Kami menerima pembayaran melalui Transfer Bank (BCA, Mandiri, BRI, BNI), E-Wallet (GoPay, OVO, Dana, ShopeePay), dan QRIS."
                },
                {
                    question: "Bagaimana jika pesanan saya belum masuk?",
                    answer: "Jika pesanan belum masuk melewati estimasi waktu, silakan hubungi CS kami dengan menyertakan ID Pesanan (Order ID) untuk pengecekan lebih lanjut."
                }
            ]
        },
        {
            category: "Akun & Keamanan",
            icon: <Shield className="h-5 w-5 text-primary" />,
            items: [
                {
                    question: "Apakah saya perlu memberikan password akun Roblox?",
                    answer: "Untuk layanan Robux via Login dan Joki, kami memerlukan akses ke akun Anda. Namun, kami menjamin kerahasiaan data login Anda. Untuk Robux 5 Hari (Gamepass), tidak perlu password."
                },
                {
                    question: "Apakah akun saya bisa terkena banned?",
                    answer: "Kami menggunakan metode yang aman dan legal, sehingga risiko banned sangat minim. Namun, kami selalu menyarankan untuk mengaktifkan verifikasi 2 langkah (2FA) untuk keamanan tambahan."
                }
            ]
        }
    ]

    return (
        <div className="container py-12 md:py-16 max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Frequently Asked Questions
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Temukan jawaban untuk pertanyaan yang sering diajukan seputar layanan AbibShop.
                </p>
            </div>

            <div className="grid gap-8">
                {faqs.map((section, index) => (
                    <Card key={index} className="border-none shadow-md bg-gradient-to-b from-background to-muted/20">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    {section.icon}
                                </div>
                                <CardTitle>{section.category}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {section.items.map((item, i) => (
                                    <AccordionItem key={i} value={`item-${index}-${i}`}>
                                        <AccordionTrigger className="text-left font-medium">
                                            {item.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground leading-relaxed">
                                            {item.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-12 text-center p-8 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-primary" />
                    </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Masih ada pertanyaan?</h3>
                <p className="text-muted-foreground mb-6">
                    Tim Customer Service kami siap membantu Anda setiap hari.
                </p>
                <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    Hubungi WhatsApp
                </a>
            </div>
        </div>
    )
}
