import Link from "next/link"

export default function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container py-8 md:py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            AbibShop
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Platform top up Roblox terpercaya, cepat, dan aman di Indonesia.
                        </p>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold">Layanan</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/products" className="hover:text-primary">Robux Murah</Link></li>
                            <li><Link href="/products" className="hover:text-primary">Gamepass</Link></li>
                            <li><Link href="/products" className="hover:text-primary">Joki Level</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold">Bantuan</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/tracking" className="hover:text-primary">Cek Pesanan</Link></li>
                            <li><Link href="#" className="hover:text-primary">Syarat & Ketentuan</Link></li>
                            <li><Link href="#" className="hover:text-primary">Kebijakan Privasi</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold">Hubungi Kami</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>WhatsApp: +62 812-3456-7890</li>
                            <li>Email: support@abibshop.com</li>
                            <li>Jam Operasional: 09:00 - 22:00 WIB</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} AbibShop. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
