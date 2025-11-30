import { Card, CardHeader, CardDescription, CardFooter } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function TestimonialsSection() {
    return (
        <section className="py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/50" />
            <div className="container px-4 md:px-6 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Apa Kata Mereka?</h2>
                    <p className="text-muted-foreground">Testimoni dari customer setia kami</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="hover-lift border-none shadow-lg bg-gradient-to-br from-background to-muted/30">
                            <CardHeader>
                                <div className="flex gap-1 text-yellow-500 mb-2">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className="fill-current h-4 w-4" />
                                    ))}
                                </div>
                                <CardDescription className="text-base">
                                    "Pelayanan sangat cepat, admin ramah, dan harga paling murah dibanding toko sebelah. Recommended banget!"
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                        U{i}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">User {i}</p>
                                        <p className="text-xs text-muted-foreground">Verified Buyer</p>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
