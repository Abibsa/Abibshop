"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, Award, Star, ChevronRight, ChevronLeft, Clock, Gift, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isHovering, setIsHovering] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const slides = [
        {
            id: 1,
            type: "hero",
            title: "Top Up Roblox",
            subtitle: "Termurah & Terpercaya",
            description: "Solusi terbaik untuk kebutuhan Roblox kamu. Beli Robux, Gamepass, dan Joki Level dengan harga bersahabat dan proses kilat.",
            primaryBtn: { text: "Beli Sekarang", href: "/products" },
            secondaryBtn: { text: "Cek Pesanan", href: "/tracking" }
        },
        {
            id: 2,
            type: "product",
            title: "Top Up Robux",
            subtitle: "Proses Kilat & Aman",
            description: "Dapatkan Robux instan dengan harga termurah. Tersedia berbagai nominal mulai dari 400 Robux.",
            image: "/images/robux-5-hari.png", // Keep existing placeholder or update if available
            color: "from-purple-600 to-pink-600",
            bgGlow: "bg-purple-500/20",
            icon: <Zap className="h-5 w-5" />,
            primaryBtn: { text: "Beli Robux", href: "/products?category=Robux" }
        },
        {
            id: 3,
            type: "product",
            title: "Roblox Premium",
            subtitle: "Membership Resmi",
            description: "Langganan Premium bulanan. Dapat Robux bulanan + diskon di catalog + fitur eksklusif.",
            image: "/images/robux-gift-card.png", // Placeholder
            color: "from-yellow-500 to-orange-500",
            bgGlow: "bg-orange-500/20",
            icon: <Award className="h-5 w-5" />,
            primaryBtn: { text: "Beli Premium", href: "/products?category=Premium" }
        },
        {
            id: 4,
            type: "product",
            title: "Jaminan Garansi",
            subtitle: "100% Legal & Aman",
            description: "Semua transaksi di AbibShop bergaransi. Jika ada kendala, CS kami siap membantu 24/7.",
            image: "/images/robux-via-login.png", // Placeholder
            color: "from-blue-600 to-cyan-600",
            bgGlow: "bg-blue-500/20",
            icon: <Star className="h-5 w-5" />,
            primaryBtn: { text: "Lihat Semua", href: "/products" }
        }
    ]

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
    }

    useEffect(() => {
        resetTimeout()
        if (!isHovering) {
            timeoutRef.current = setTimeout(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length)
            }, 6000)
        }
        return () => resetTimeout()
    }, [currentSlide, isHovering, slides.length])

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

    return (
        <section
            className="relative min-h-[550px] md:min-h-[650px] flex items-center overflow-hidden bg-background py-8 md:py-12"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Background Effects */}
            <div className="absolute inset-0 gradient-mesh opacity-30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background pointer-events-none" />

            <div className="container relative z-10 px-4 md:px-6 h-full flex flex-col justify-center">
                <div className="relative w-full max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="w-full"
                        >
                            {slides[currentSlide].type === "hero" ? (
                                // Hero Slide Layout (Centered)
                                <div className="text-center max-w-4xl mx-auto py-4 md:py-10">
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 mb-4 md:mb-6 rounded-full bg-primary/10 border border-primary/20"
                                    >
                                        <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                                        <span className="text-xs md:text-sm font-medium text-primary">Platform Top Up Roblox Terpercaya</span>
                                    </motion.div>

                                    <motion.h1
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 md:mb-6 leading-tight"
                                    >
                                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                            {slides[currentSlide].title}
                                        </span>
                                        <br />
                                        <span className="text-foreground">{slides[currentSlide].subtitle}</span>
                                    </motion.h1>

                                    <motion.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8 px-4"
                                    >
                                        {slides[currentSlide].description}
                                    </motion.p>

                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mb-8 md:mb-12 px-4"
                                    >
                                        <Button size="lg" asChild className="text-base md:text-lg px-6 md:px-8 gradient-primary hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 h-10 md:h-12">
                                            <Link href={slides[currentSlide].primaryBtn.href}>
                                                <Sparkles className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                                                {slides[currentSlide].primaryBtn.text}
                                            </Link>
                                        </Button>
                                        <Button size="lg" variant="outline" asChild className="text-base md:text-lg px-6 md:px-8 hover-lift border-2 h-10 md:h-12">
                                            <Link href={slides[currentSlide].secondaryBtn!.href}>
                                                {slides[currentSlide].secondaryBtn!.text}
                                            </Link>
                                        </Button>
                                    </motion.div>

                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="grid grid-cols-3 gap-2 md:gap-4 max-w-xl mx-auto px-2"
                                    >
                                        <div className="text-center p-2 md:p-4 rounded-xl md:rounded-2xl bg-background/50 backdrop-blur border shadow-sm">
                                            <div className="flex justify-center text-green-500 mb-1 md:mb-2"><TrendingUp className="h-5 w-5 md:h-6 md:w-6" /></div>
                                            <div className="font-bold text-lg md:text-2xl">10k+</div>
                                            <div className="text-[10px] md:text-xs text-muted-foreground">Transaksi</div>
                                        </div>
                                        <div className="text-center p-2 md:p-4 rounded-xl md:rounded-2xl bg-background/50 backdrop-blur border shadow-sm">
                                            <div className="flex justify-center text-blue-500 mb-1 md:mb-2"><Award className="h-5 w-5 md:h-6 md:w-6" /></div>
                                            <div className="font-bold text-lg md:text-2xl">98%</div>
                                            <div className="text-[10px] md:text-xs text-muted-foreground">Puas</div>
                                        </div>
                                        <div className="text-center p-2 md:p-4 rounded-xl md:rounded-2xl bg-background/50 backdrop-blur border shadow-sm">
                                            <div className="flex justify-center text-yellow-500 mb-1 md:mb-2"><Star className="h-5 w-5 md:h-6 md:w-6 fill-current" /></div>
                                            <div className="font-bold text-lg md:text-2xl">4.9</div>
                                            <div className="text-[10px] md:text-xs text-muted-foreground">Rating</div>
                                        </div>
                                    </motion.div>
                                </div>
                            ) : (
                                // Product Slide Layout (Split)
                                <div className="flex flex-col-reverse md:flex-row items-center gap-6 md:gap-12 py-4 md:py-8">
                                    <div className="flex-1 text-center md:text-left z-10 w-full">
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                            className={`inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 mb-4 md:mb-6 rounded-full bg-gradient-to-r ${slides[currentSlide].color} bg-opacity-10 border border-white/10 shadow-sm`}
                                        >
                                            <div className="text-white p-1 rounded-full bg-black/10 dark:bg-white/20">
                                                {slides[currentSlide].icon}
                                            </div>
                                            <span className="text-xs md:text-sm font-bold tracking-wide uppercase text-foreground/80">
                                                Featured Product
                                            </span>
                                        </motion.div>

                                        <motion.h2
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 leading-tight"
                                        >
                                            {slides[currentSlide].title}
                                            <br />
                                            <span className={`bg-gradient-to-r ${slides[currentSlide].color} bg-clip-text text-transparent`}>
                                                {slides[currentSlide].subtitle}
                                            </span>
                                        </motion.h2>

                                        <motion.p
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-xl mx-auto md:mx-0 px-2 md:px-0"
                                        >
                                            {slides[currentSlide].description}
                                        </motion.p>

                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <Button size="lg" asChild className={`text-base md:text-lg px-6 md:px-8 bg-gradient-to-r ${slides[currentSlide].color} hover:opacity-90 transition-all shadow-lg text-white border-0 h-10 md:h-12`}>
                                                <Link href={slides[currentSlide].primaryBtn.href}>
                                                    Beli Sekarang
                                                    <ChevronRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                                                </Link>
                                            </Button>
                                        </motion.div>
                                    </div>

                                    <div className="flex-1 w-full max-w-[280px] sm:max-w-sm md:max-w-full mx-auto">
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                                            className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                                        >
                                            <div className={`absolute inset-0 ${slides[currentSlide].bgGlow} opacity-30 blur-2xl`} />
                                            <div className="absolute inset-0 flex items-center justify-center p-6 md:p-12">
                                                <Image
                                                    src={slides[currentSlide].image!}
                                                    alt={slides[currentSlide].title}
                                                    width={500}
                                                    height={500}
                                                    className="object-contain w-full h-full drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                                                    priority
                                                />
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons - Visible on hover or touch */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-2 md:px-0">
                        <button
                            onClick={prevSlide}
                            className="pointer-events-auto p-2 md:p-3 rounded-full bg-background/80 backdrop-blur border shadow-lg hover:bg-background hover:scale-110 transition-all md:-translate-x-12 group opacity-70 hover:opacity-100"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground group-hover:text-foreground" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="pointer-events-auto p-2 md:p-3 rounded-full bg-background/80 backdrop-blur border shadow-lg hover:bg-background hover:scale-110 transition-all md:translate-x-12 group opacity-70 hover:opacity-100"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground group-hover:text-foreground" />
                        </button>
                    </div>

                    {/* Dots Indicators */}
                    <div className="absolute -bottom-6 md:-bottom-10 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-20">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-2 md:h-2.5 rounded-full transition-all duration-500 ${currentSlide === index
                                    ? "w-6 md:w-10 bg-primary"
                                    : "w-2 md:w-2.5 bg-primary/20 hover:bg-primary/40"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
