"use client"

import Link from "next/link"
import { useState } from "react"
import { Instagram, MessageCircle, Mail, Clock, Sparkles, FileText, Shield, CheckCircle2, XCircle } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function Footer() {
    const currentYear = new Date().getFullYear()
    const [termsOpen, setTermsOpen] = useState(false)
    const [privacyOpen, setPrivacyOpen] = useState(false)

    const handleAccept = (type: 'terms' | 'privacy') => {
        if (type === 'terms') {
            setTermsOpen(false)
        } else {
            setPrivacyOpen(false)
        }
        // You can add logic here to save acceptance to localStorage or backend
    }

    const handleDecline = (type: 'terms' | 'privacy') => {
        if (type === 'terms') {
            setTermsOpen(false)
        } else {
            setPrivacyOpen(false)
        }
    }

    return (
        <>
            <footer className="relative border-t bg-gradient-to-b from-background to-muted/50 overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                <div className="container relative z-10 py-10 md:py-16 px-4 md:px-6">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 gap-8 md:gap-12 md:grid-cols-4 mb-8 md:mb-12">
                        {/* Brand Section */}
                        <div className="space-y-4 md:col-span-1">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                                <h3 className="text-xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    AbibShop
                                </h3>
                            </div>
                            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                                Platform top up Roblox terpercaya #1 di Indonesia. Proses cepat, harga murah, dan aman 100%.
                            </p>
                            {/* Social Media */}
                            <div className="flex gap-3 pt-2">
                                <Link
                                    href="#"
                                    className="h-9 w-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-all hover:scale-110 group border border-transparent hover:border-primary/20"
                                >
                                    <Instagram className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </Link>
                                <Link
                                    href="#"
                                    className="h-9 w-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-all hover:scale-110 group border border-transparent hover:border-primary/20"
                                >
                                    <MessageCircle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </Link>
                                <Link
                                    href="#"
                                    className="h-9 w-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-all hover:scale-110 group border border-transparent hover:border-primary/20"
                                >
                                    <Mail className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </Link>
                            </div>
                        </div>

                        {/* Links Grid */}
                        <div className="grid grid-cols-2 gap-6 md:col-span-3 md:grid-cols-3">
                            {/* Layanan */}
                            <div>
                                <h4 className="mb-4 text-sm font-bold text-foreground">Layanan</h4>
                                <ul className="space-y-2.5 text-xs md:text-sm">
                                    <li>
                                        <Link href="/products?category=Robux" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                                            <span className="group-hover:translate-x-1 transition-transform">Top Up Robux</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/products?category=Premium" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                                            <span className="group-hover:translate-x-1 transition-transform">Roblox Premium</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                                            <span className="group-hover:translate-x-1 transition-transform">Semua Produk</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Bantuan */}
                            <div>
                                <h4 className="mb-4 text-sm font-bold text-foreground">Bantuan</h4>
                                <ul className="space-y-2.5 text-xs md:text-sm">
                                    <li>
                                        <Link href="/tracking" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                                            <span className="group-hover:translate-x-1 transition-transform">Cek Pesanan</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/my-orders" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                                            <span className="group-hover:translate-x-1 transition-transform">Riwayat Pesanan</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                                            <span className="group-hover:translate-x-1 transition-transform">FAQ</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Kontak */}
                            <div className="col-span-2 md:col-span-1">
                                <h4 className="mb-4 text-sm font-bold text-foreground">Hubungi Kami</h4>
                                <ul className="space-y-3 text-xs md:text-sm">
                                    <li className="flex items-start gap-2 text-muted-foreground">
                                        <MessageCircle className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                                        <span>+62 812-3456-7890</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-muted-foreground">
                                        <Mail className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                                        <span>support@abibshop.com</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-muted-foreground">
                                        <Clock className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                                        <span>09:00 - 22:00 WIB</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-6 md:pt-8 border-t border-border/50">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left">
                                &copy; {currentYear} <span className="font-semibold text-foreground">AbibShop</span>. All rights reserved.
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setTermsOpen(true)}
                                    className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-all px-3 py-1.5 rounded-md hover:bg-primary/5 border border-transparent hover:border-primary/20"
                                >
                                    Syarat & Ketentuan
                                </button>
                                <div className="h-4 w-px bg-border" />
                                <button
                                    onClick={() => setPrivacyOpen(true)}
                                    className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-all px-3 py-1.5 rounded-md hover:bg-primary/5 border border-transparent hover:border-primary/20"
                                >
                                    Kebijakan Privasi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Terms & Conditions Dialog */}
            <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-white" />
                            </div>
                            <DialogTitle className="text-2xl">Syarat & Ketentuan</DialogTitle>
                        </div>
                        <DialogDescription>
                            Harap baca dengan seksama sebelum menggunakan layanan kami
                        </DialogDescription>
                    </DialogHeader>

                    <div className="h-[400px] overflow-y-auto pr-4">
                        <div className="space-y-4 text-sm">
                            <section>
                                <h3 className="font-semibold text-base mb-2">1. Ketentuan Umum</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Dengan menggunakan layanan AbibShop, Anda menyetujui untuk terikat dengan syarat dan ketentuan yang berlaku. Kami berhak mengubah ketentuan ini sewaktu-waktu tanpa pemberitahuan terlebih dahulu.
                                </p>
                            </section>

                            <section>
                                <h3 className="font-semibold text-base mb-2">2. Layanan Top Up</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Semua transaksi top up Robux dilakukan dengan metode yang legal dan aman. Proses pengiriman dilakukan maksimal 1x24 jam setelah pembayaran dikonfirmasi. Kami tidak bertanggung jawab atas kesalahan input data yang dilakukan oleh pembeli.
                                </p>
                            </section>

                            <section>
                                <h3 className="font-semibold text-base mb-2">3. Pembayaran</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Pembayaran harus dilakukan sesuai dengan nominal yang tertera. Pesanan yang belum dibayar dalam 2x24 jam akan otomatis dibatalkan. Bukti pembayaran harus dikirimkan melalui WhatsApp untuk konfirmasi.
                                </p>
                            </section>

                            <section>
                                <h3 className="font-semibold text-base mb-2">4. Kebijakan Pengembalian</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Pengembalian dana hanya dapat dilakukan jika terjadi kesalahan dari pihak kami. Tidak ada pengembalian dana untuk kesalahan input data dari pembeli atau perubahan pikiran setelah transaksi selesai.
                                </p>
                            </section>

                            <section>
                                <h3 className="font-semibold text-base mb-2">5. Larangan</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Dilarang keras melakukan penipuan, chargeback, atau tindakan yang merugikan pihak AbibShop. Pelanggaran akan mengakibatkan pemblokiran akun dan tindakan hukum.
                                </p>
                            </section>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => handleDecline('terms')}
                            className="gap-2"
                        >
                            <XCircle className="h-4 w-4" />
                            Tidak Setuju
                        </Button>
                        <Button
                            onClick={() => handleAccept('terms')}
                            className="gap-2 gradient-primary"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Saya Setuju
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Privacy Policy Dialog */}
            <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <Shield className="h-5 w-5 text-white" />
                            </div>
                            <DialogTitle className="text-2xl">Kebijakan Privasi</DialogTitle>
                        </div>
                        <DialogDescription>
                            Perlindungan data pribadi Anda adalah prioritas kami
                        </DialogDescription>
                    </DialogHeader>

                    <div className="h-[400px] overflow-y-auto pr-4">
                        <div className="space-y-4 text-sm">
                            <section>
                                <h3 className="font-semibold text-base mb-2">1. Pengumpulan Data</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Kami mengumpulkan informasi yang Anda berikan saat melakukan transaksi, termasuk nama, nomor WhatsApp, email, dan data pembayaran. Data ini digunakan untuk memproses pesanan dan memberikan layanan terbaik.
                                </p>
                            </section>

                            <section>
                                <h3 className="font-semibold text-base mb-2">2. Penggunaan Data</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Data pribadi Anda digunakan untuk memproses transaksi, mengirimkan notifikasi pesanan, dan memberikan dukungan pelanggan. Kami tidak akan menjual atau membagikan data Anda kepada pihak ketiga tanpa izin.
                                </p>
                            </section>

                            <section>
                                <h3 className="font-semibold text-base mb-2">3. Keamanan Data</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Kami menggunakan enkripsi dan protokol keamanan standar industri untuk melindungi data Anda. Namun, tidak ada sistem yang 100% aman, dan kami tidak dapat menjamin keamanan absolut.
                                </p>
                            </section>

                            <section>
                                <h3 className="font-semibold text-base mb-2">4. Cookie dan Tracking</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Website kami menggunakan cookie untuk meningkatkan pengalaman pengguna dan menganalisis traffic. Anda dapat menonaktifkan cookie melalui pengaturan browser, namun beberapa fitur mungkin tidak berfungsi optimal.
                                </p>
                            </section>

                            <section>
                                <h3 className="font-semibold text-base mb-2">5. Hak Pengguna</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Anda berhak untuk mengakses, mengubah, atau menghapus data pribadi Anda. Untuk permintaan terkait data, silakan hubungi kami melalui email support@abibshop.com.
                                </p>
                            </section>

                            <section>
                                <h3 className="font-semibold text-base mb-2">6. Perubahan Kebijakan</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Kami dapat memperbarui kebijakan privasi ini sewaktu-waktu. Perubahan akan diumumkan di website dan mulai berlaku setelah dipublikasikan.
                                </p>
                            </section>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => handleDecline('privacy')}
                            className="gap-2"
                        >
                            <XCircle className="h-4 w-4" />
                            Tidak Setuju
                        </Button>
                        <Button
                            onClick={() => handleAccept('privacy')}
                            className="gap-2 gradient-primary"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Saya Setuju
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
