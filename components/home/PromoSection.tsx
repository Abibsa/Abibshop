import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gift, Sparkles, Coins } from "lucide-react"

export default function PromoSection() {
    return (
        <section className="py-4 sm:py-6 md:py-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 animate-gradient-x" />
            <div className="container px-3 sm:px-4 md:px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <Card className="border-none shadow-2xl bg-white/95 backdrop-blur overflow-hidden">
                        <CardContent className="p-4 sm:p-6 md:p-8">
                            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-5 md:gap-6">
                                <div className="flex-shrink-0">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse" />
                                        <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-4 sm:p-5 md:p-6 rounded-full">
                                            <Gift className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                                        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                                        <span className="text-xs sm:text-sm font-semibold text-yellow-600 uppercase tracking-wide">Fitur Baru!</span>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                                        Dapatkan Robux Gratis!
                                    </h3>
                                    <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-3 md:mb-4 px-2 md:px-0">
                                        Login harian, Game Pass 5 hari, kode redeem, dan gift card. Kumpulkan Robux setiap hari!
                                    </p>
                                    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start">
                                        <div className="flex items-center gap-1.5 sm:gap-2 bg-yellow-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                                            <Coins className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
                                            <span className="text-xs sm:text-sm font-semibold text-yellow-700">Login Harian</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 sm:gap-2 bg-orange-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                                            <Gift className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                                            <span className="text-xs sm:text-sm font-semibold text-orange-700">Game Pass 5 Hari</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 w-full md:w-auto">
                                    <Button size="lg" asChild className="w-full md:w-auto bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white shadow-xl hover:shadow-2xl transition-all text-sm sm:text-base md:text-lg px-6 sm:px-8">
                                        <Link href="/robux">
                                            <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                            Mulai Sekarang
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
