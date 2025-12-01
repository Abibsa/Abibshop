import { Card, CardHeader, CardDescription, CardFooter } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

export default function TestimonialsSection() {
    const testimonials = [
        {
            name: "Rizky A.",
            role: "Verified Buyer",
            rating: 5,
            text: "Fast respon, harga murah, dan proses cepat. Baru 5 menit langsung masuk robuxnya. Recommended!",
            initial: "R",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            name: "Dinda M.",
            role: "Verified Buyer",
            rating: 5,
            text: "Udah langganan disini, selalu aman dan terpercaya. Admin juga ramah banget kalo ada kendala.",
            initial: "D",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            name: "Farhan K.",
            role: "Verified Buyer",
            rating: 5,
            text: "Pertama kali beli disini agak ragu, tapi ternyata legit. Harga lebih murah dari tempat lain.",
            initial: "F",
            gradient: "from-orange-500 to-red-500"
        }
    ]

    return (
        <section className="py-8 md:py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/50" />
            <div className="container px-4 md:px-6 relative z-10">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Apa Kata Mereka?</h2>
                    <p className="text-sm md:text-base text-muted-foreground">Testimoni dari customer setia kami</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, i) => (
                        <Card key={i} className="hover-lift border-none shadow-lg bg-gradient-to-br from-background to-muted/30 relative overflow-hidden group">
                            <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
                            <CardHeader className="pb-3 md:pb-4">
                                <div className="flex gap-1 text-yellow-500 mb-2 md:mb-3">
                                    {[...Array(testimonial.rating)].map((_, j) => (
                                        <Star key={j} className="fill-current h-3.5 w-3.5 md:h-4 md:w-4" />
                                    ))}
                                </div>
                                <CardDescription className="text-sm md:text-base leading-relaxed relative z-10">
                                    "{testimonial.text}"
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="pt-0">
                                <div className="flex items-center gap-3">
                                    <div className={`h-9 w-9 md:h-10 md:w-10 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                                        {testimonial.initial}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{testimonial.name}</p>
                                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
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
