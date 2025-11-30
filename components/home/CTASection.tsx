import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export default function CTASection() {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

            <div className="container px-4 md:px-6 text-center relative z-10">
                <div className="max-w-3xl mx-auto text-white">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-slide-up">
                        Siap Top Up Sekarang?
                    </h2>
                    <p className="text-lg md:text-xl mb-8 opacity-90">
                        Jangan lewatkan promo menarik hari ini. Dapatkan Robux dan item impianmu sekarang juga.
                    </p>
                    <Button size="lg" variant="secondary" asChild className="text-lg px-8 hover-lift shadow-2xl">
                        <Link href="/products">
                            <Sparkles className="mr-2 h-5 w-5" />
                            Mulai Belanja
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
