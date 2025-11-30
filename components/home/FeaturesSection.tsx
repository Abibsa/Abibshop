import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ShieldCheck, Zap, Clock } from "lucide-react"

export default function FeaturesSection() {
    const features = [
        {
            icon: <ShieldCheck className="h-10 w-10" />,
            title: "100% Legal & Aman",
            description: "Transaksi aman dengan metode legal, anti-banned.",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            icon: <Zap className="h-10 w-10" />,
            title: "Proses Cepat",
            description: "Pesanan diproses otomatis 24/7 dalam hitungan menit.",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            icon: <Clock className="h-10 w-10" />,
            title: "Layanan 24/7",
            description: "Customer service siap membantu kapan saja.",
            gradient: "from-orange-500 to-red-500"
        },
    ]

    return (
        <section className="py-16 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
            <div className="container px-4 md:px-6 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Kenapa Pilih AbibShop?</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Kami memberikan pelayanan terbaik dengan jaminan keamanan dan kecepatan
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-none shadow-lg hover-lift bg-gradient-to-br from-background to-muted/50 overflow-hidden group">
                            <CardHeader className="flex flex-col items-center text-center relative">
                                <div className={`mb-4 p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-muted-foreground">
                                {feature.description}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
