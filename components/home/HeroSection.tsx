import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, Award, Star } from "lucide-react"

export default function HeroSection() {
    const stats = [
        { label: "Transaksi Sukses", value: "10,000+", icon: <TrendingUp className="h-5 w-5" /> },
        { label: "Customer Puas", value: "98%", icon: <Award className="h-5 w-5" /> },
        { label: "Rating", value: "4.9/5", icon: <Star className="h-5 w-5 fill-current" /> },
    ]

    return (
        <section className="relative py-20 md:py-32 overflow-hidden">
            <div className="absolute inset-0 gradient-mesh opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />

            <div className="container relative z-10 px-4 md:px-6 text-center">
                <div className="animate-slide-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Platform Top Up Roblox Terpercaya</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Top Up Roblox
                        </span>
                        <br />
                        <span className="text-foreground">Termurah & Terpercaya</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Solusi terbaik untuk kebutuhan Roblox kamu. Beli Robux, Gamepass, dan Joki Level dengan harga bersahabat dan proses kilat.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                        <Button size="lg" asChild className="text-lg px-8 gradient-primary hover:opacity-90 transition-opacity">
                            <Link href="/products">
                                <Sparkles className="mr-2 h-5 w-5" />
                                Beli Sekarang
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild className="text-lg px-8 hover-lift">
                            <Link href="/tracking">Cek Pesanan</Link>
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                                    {stat.icon}
                                </div>
                                <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                                <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
