"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, Package, Clock, CheckCircle2, AlertCircle, ExternalLink, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";

export default function TrackingPage() {
    const [orderNumber, setOrderNumber] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderNumber || !whatsapp) {
            toast.error("Isi Nomor Pesanan dan WhatsApp!");
            return;
        }

        setLoading(true);
        setOrder(null);

        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .eq("order_number", orderNumber.trim().toUpperCase())
            .eq("customer_whatsapp", whatsapp.trim())
            .single();

        if (error) {
            toast.error("Pesanan tidak ditemukan. Periksa kembali data Anda.");
        } else {
            setOrder(data);
        }
        setLoading(false);
    };

    const getStatusInfo = (status: string, payStatus: string) => {
        if (payStatus === 'pending') return {
            icon: <Clock className="w-8 h-8 text-yellow-500" />,
            title: "Menunggu Pembayaran",
            desc: "Silakan selesaikan pembayaran agar pesanan dapat diproses.",
            color: "bg-yellow-50 text-yellow-700 border-yellow-200"
        };
        if (status === 'completed') return {
            icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
            title: "Pesanan Selesai",
            desc: "Produk telah berhasil dikirim ke akun/username Anda.",
            color: "bg-green-50 text-green-700 border-green-200"
        };
        if (status === 'processing') return {
            icon: <Package className="w-8 h-8 text-blue-500" />,
            title: "Sedang Diproses",
            desc: "Tim kami sedang menyiapkan pengiriman item untuk Anda.",
            color: "bg-blue-50 text-blue-700 border-blue-200"
        };
        return {
            icon: <AlertCircle className="w-8 h-8 text-red-500" />,
            title: "Gagal / Batal",
            desc: "Pesanan dibatalkan atau terjadi kesalahan sistem.",
            color: "bg-red-50 text-red-700 border-red-200"
        };
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <main className="flex-1 container max-w-4xl mx-auto px-4 py-16 ml-auto mr-auto">
                <div className="text-center space-y-4 mb-12">
                    <Badge className="px-4 py-1 rounded-full bg-primary/10 text-primary border-none text-sm font-semibold">Track Order</Badge>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">Cek Status Pesanan</h1>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        Masukkan detail pesanan Anda untuk melihat perkembangan terbaru proses pengiriman.
                    </p>
                </div>

                <div className="grid md:grid-cols-1 gap-8">
                    <Card className="shadow-2xl border-none overflow-hidden bg-white dark:bg-gray-900">
                        <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600" />
                        <CardContent className="p-8">
                            <form onSubmit={handleTrack} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                                <div className="space-y-3">
                                    <Label htmlFor="orderNumber" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Nomor Pesanan</Label>
                                    <Input
                                        id="orderNumber"
                                        placeholder="Contoh: ABIB-XXXX"
                                        value={orderNumber}
                                        onChange={(e) => setOrderNumber(e.target.value)}
                                        className="h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="whatsapp" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">No. WhatsApp</Label>
                                    <Input
                                        id="whatsapp"
                                        placeholder="0812XXXXXXXX"
                                        value={whatsapp}
                                        onChange={(e) => setWhatsapp(e.target.value)}
                                        className="h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl"
                                    />
                                </div>
                                <Button type="submit" disabled={loading} className="h-12 rounded-xl gradient-primary font-bold shadow-lg shadow-blue-500/20">
                                    {loading ? "Searching..." : <><Search className="w-5 h-5 mr-2" /> Lacak Pesanan</>}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {order && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
                            <Card className="border-none shadow-xl bg-white dark:bg-gray-900 overflow-hidden">
                                <div className={`p-8 flex flex-col md:flex-row items-center gap-6 border-b dark:border-gray-800 ${getStatusInfo(order.status, order.payment_status).color}`}>
                                    {getStatusInfo(order.status, order.payment_status).icon}
                                    <div className="text-center md:text-left flex-1">
                                        <h2 className="text-2xl font-black">{getStatusInfo(order.status, order.payment_status).title}</h2>
                                        <p className="opacity-80">{getStatusInfo(order.status, order.payment_status).desc}</p>
                                    </div>
                                    {order.payment_status === 'pending' && order.payment_url && (
                                        <Button asChild className="gradient-primary shadow-xl">
                                            <Link href={order.payment_url} target="_blank">
                                                Bayar Sekarang <ExternalLink className="w-4 h-4 ml-2" />
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                                <CardContent className="p-8">
                                    <div className="grid md:grid-cols-2 gap-12">
                                        <div className="space-y-6">
                                            <h3 className="font-black text-lg flex items-center gap-2"><div className="w-1 h-6 bg-primary rounded-full" /> Detail Pesanan</h3>
                                            <div className="grid grid-cols-2 gap-y-4">
                                                <div className="text-muted-foreground font-medium">Nomor Pesanan</div>
                                                <div className="font-bold text-right">{order.order_number}</div>
                                                <div className="text-muted-foreground font-medium">Tanggal</div>
                                                <div className="font-bold text-right">{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                                <div className="text-muted-foreground font-medium">Metode Bayar</div>
                                                <div className="font-bold text-right">{order.payment_name || order.payment_method}</div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h3 className="font-black text-lg flex items-center gap-2"><div className="w-1 h-6 bg-primary rounded-full" /> Item & Target</h3>
                                            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold">{order.product_name}</span>
                                                    <span className="text-primary font-black">Rp {Number(order.total_amount).toLocaleString('id-ID')}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-muted-foreground">Username Roblox</span>
                                                    <Badge className="bg-primary/10 text-primary border-none">{order.game_username}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-8 pt-0 flex justify-center border-t dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                                    <p className="text-xs text-muted-foreground flex items-center gap-2 mt-4">
                                        <ShieldCheck className="w-4 h-4" /> Transaksi Aman & Terenkripsi. Butuh bantuan? <Link href="https://wa.me/6281234567890" className="text-primary font-bold hover:underline">Hubungi Admin</Link>
                                    </p>
                                </CardFooter>
                            </Card>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
