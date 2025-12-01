import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ShieldCheck, Zap, Clock } from "lucide-react"

export default function FeaturesSection() {
    const features = [
        {
            icon: <ShieldCheck />,
            title: "100% Legal & Aman",
            description: "Transaksi aman dengan metode legal, anti-banned.",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            icon: <Zap />,
            title: "Proses Cepat",
            description: "Pesanan diproses otomatis 24/7 dalam hitungan menit.",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            icon: <Clock />,
            title: "Layanan 24/7",
            description: "Customer service siap membantu kapan saja.",
            gradient: "from-orange-500 to-red-500"
        },
    ]

    return (
        <section className="py-8 md:py-16 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
            <div className="container px-4 md:px-6 relative z-10">
                <div className="text-center mb-6 md:mb-12">
                    <h2 className="text-xl md:text-4xl font-bold mb-2 md:mb-4">Kenapa Pilih AbibShop?</h2>
                    <p className="text-xs md:text-base text-muted-foreground max-w-2xl mx-auto px-2">
                        Kami memberikan pelayanan terbaik dengan jaminan keamanan dan kecepatan
                    </p>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-none shadow-lg hover-lift bg-gradient-to-br from-background to-muted/50 overflow-hidden group">
                            <CardHeader className="flex flex-col items-center text-center relative p-3 md:p-6 pb-2 md:pb-4">
                                <div className={`mb-2 md:mb-4 p-2 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <div className="[&>svg]:h-4 [&>svg]:w-4 md:[&>svg]:h-10 md:[&>svg]:w-10">
                                        {feature.icon}
                                    </div>
                                </div>
                                <CardTitle className="text-[10px] md:text-xl leading-tight">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-[9px] md:text-base text-muted-foreground px-2 md:px-6 pb-3 md:pb-6 leading-tight">
                                {feature.description}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
