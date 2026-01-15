"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gift, CheckCircle2, Zap, ShieldCheck, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function GiftPromoSection() {
    const benefits = [
        "Tidak perlu login akun kamu",
        "Aman & privasi terjaga",
        "Tidak ada risiko akun terkena rollback atau ban",
        "Proses cepat & langsung masuk",
        "Lebih aman & lebih cepat dibanding metode Gamepass & Login"
    ]

    const priceList = [
        { amount: "400", price: "Rp 85.000" },
        { amount: "800", price: "Rp 150.000" },
        { amount: "1000", price: "Rp 175.000" },
    ]

    return (
        <section className="py-16 md:py-24 relative overflow-hidden bg-background">
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-500/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-500/10 blur-[100px] rounded-full" />

            <div className="container px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 items-center">

                    {/* Left Content */}
                    <div className="flex-1 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 mb-6"
                        >
                            <Gift className="h-4 w-4" />
                            <span className="text-sm font-semibold">Metode Paling Recommended</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
                        >
                            Robux via Gift <br />
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                (Tanpa Login Akun)
                            </span>
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4 mb-8"
                        >
                            {benefits.map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                                    <p className="text-base md:text-lg text-muted-foreground">{item}</p>
                                </div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="p-6 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl border border-blue-100 dark:border-blue-800"
                        >
                            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                                <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                Kenapa Gift lebih unggul?
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex gap-2 text-sm md:text-base">
                                    <span className="font-semibold text-red-500">❌</span>
                                    <span className="text-muted-foreground">Gamepass harus nunggu ±5 hari → <span className="text-foreground font-medium">Lama</span></span>
                                </li>
                                <li className="flex gap-2 text-sm md:text-base">
                                    <span className="font-semibold text-red-500">❌</span>
                                    <span className="text-muted-foreground">Login akun berisiko keamanan & privasi</span>
                                </li>
                                <li className="flex gap-2 text-sm md:text-base">
                                    <span className="font-semibold text-green-500">✅</span>
                                    <span className="text-foreground font-medium">Gift card langsung masuk, tanpa akses akun sama sekali</span>
                                </li>
                            </ul>
                        </motion.div>
                    </div>

                    {/* Right Content - Price List */}
                    <div className="flex-1 w-full">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="border-2 border-purple-100 dark:border-purple-900/50 shadow-2xl overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
                                <div className="p-6 md:p-8 relative z-10">
                                    <div className="text-center mb-8">
                                        <h3 className="text-2xl font-bold mb-2">Price List Robux Gift</h3>
                                        <p className="text-muted-foreground text-sm">Harga saat ini & dapat berubah sewaktu-waktu</p>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        {priceList.map((item, index) => (
                                            <div
                                                key={index}
                                                className="group flex items-center justify-between p-4 rounded-xl bg-background border hover:border-purple-500/50 transition-all shadow-sm hover:shadow-md"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                                        <Gift className="h-5 w-5" />
                                                    </div>
                                                    <span className="font-bold text-lg">{item.amount} Robux</span>
                                                </div>
                                                <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                    {item.price}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <Button size="lg" className="w-full text-lg h-12 gradient-primary shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform" asChild>
                                            <Link href="https://wa.me/6281234567890?text=Halo%20min%2C%20mau%20beli%20Robux%20Gift%20dong" target="_blank">
                                                Minat? Langsung Chat Aja!
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </Link>
                                        </Button>
                                        <p className="text-center text-sm text-muted-foreground">
                                            Lebih cepat, lebih aman, tanpa ribet
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    )
}
