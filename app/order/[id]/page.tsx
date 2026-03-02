"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, MapPin, QrCode, CreditCard, ChevronLeft, Loader2, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { simulatePayment } from "../actions";
import { useParams } from "next/navigation";
import confetti from "canvas-confetti";

export default function OrderStatusPage() {
    const params = useParams();
    const orderId = params.id as string;
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isPaying, setIsPaying] = useState(false);
    const supabase = createClient();

    const fetchOrder = async () => {
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .eq("order_number", orderId)
            .single();

        if (data) setOrder(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchOrder();

        // Realtime subscription for status changes
        const channel = supabase
            .channel('order_updates')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `order_number=eq.${orderId}` }, (payload) => {
                setOrder(payload.new);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [orderId, supabase]);

    const handleSimulatePayment = async () => {
        setIsPaying(true);
        const result = await simulatePayment(orderId);
        if (result.success) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']
            });
            toast.success("Simulasi Pembayaran Berhasil!");
            fetchOrder();
        } else {
            toast.error("Gagal simulasi pembayaran");
        }
        setIsPaying(false);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
    );

    if (!order) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold">Pesanan Tidak Ditemukan</h1>
            <Button asChild className="mt-4"><Link href="/tracking">Cari Lagi</Link></Button>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
            <Navbar />

            <main className="flex-1 container max-w-4xl mx-auto px-4 py-12 ml-auto mr-auto">
                <div className="mb-8 flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/my-orders"><ChevronLeft className="w-4 h-4 mr-1" /> Kembali</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-xl overflow-hidden bg-white dark:bg-gray-900">
                            <div className={`h-2 ${order.payment_status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                            <CardContent className="p-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                    <div>
                                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Detail Pesanan</p>
                                        <h1 className="text-3xl font-black">{order.order_number}</h1>
                                    </div>
                                    <div className="text-right">
                                        {order.payment_status === 'paid' ? (
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-4 py-1 text-sm">
                                                <CheckCircle2 className="w-4 h-4 mr-2" /> TERBAYAR
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none px-4 py-1 text-sm">
                                                <Clock className="w-4 h-4 mr-2" /> MENUNGGU PEMBAYARAN
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 py-8 border-y dark:border-gray-800">
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Produk & Layanan</p>
                                        <p className="font-bold text-lg">{order.product_name}</p>
                                        <p className="text-sm text-muted-foreground">Qty: {order.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Target Akun</p>
                                        <p className="font-black text-lg text-primary">{order.game_username}</p>
                                        <p className="text-xs text-muted-foreground">Roblox Username</p>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Metode Pembayaran</span>
                                        <span className="font-bold">{order.payment_name}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t dark:border-gray-800">
                                        <span className="text-lg font-bold">Total Pembayaran</span>
                                        <span className="text-2xl font-black text-primary">Rp {Number(order.total_amount).toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {order.payment_status === 'paid' && (
                            <Card className="border-none shadow-xl bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30 overflow-hidden">
                                <CardContent className="p-8 flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-green-500 text-white flex items-center justify-center flex-shrink-0 animate-bounce">
                                        <Sparkles className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-green-700 dark:text-green-400">Pembayaran Diterima!</h3>
                                        <p className="text-green-600 dark:text-green-500/80">
                                            Pesanan Anda sedang diproses oleh sistem. Robux akan segera dikirim ke akun {order.game_username}.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Side Action (Payment Simulator) */}
                    <div className="space-y-6">
                        {order.payment_status === 'pending' ? (
                            <Card className="border-none shadow-2xl overflow-hidden sticky top-24">
                                <div className="bg-primary p-6 text-white text-center">
                                    <QrCode className="w-12 h-12 mx-auto mb-2 opacity-80" />
                                    <h3 className="font-black text-lg text-white">SIMULASI PEMBAYARAN</h3>
                                    <p className="text-xs text-white/70">Gunakan tombol di bawah untuk simulasi lunas</p>
                                </div>
                                <CardContent className="p-6 space-y-6 text-center">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                        <p className="text-sm text-muted-foreground mb-4">Total Tagihan</p>
                                        <p className="text-3xl font-black text-primary">Rp {Number(order.total_amount).toLocaleString('id-ID')}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <Button
                                            onClick={handleSimulatePayment}
                                            disabled={isPaying}
                                            className="w-full h-12 gradient-primary font-bold shadow-lg shadow-blue-500/20"
                                        >
                                            {isPaying ? <Loader2 className="animate-spin mr-2" /> : <CreditCard className="w-5 h-5 mr-2" />}
                                            KONFIRMASI BAYAR (SIMULASI)
                                        </Button>
                                        <p className="text-[10px] text-muted-foreground">
                                            *Tombol ini menggantikan Webhook otomatis dari Duitku/Tripay untuk sementara.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-none shadow-xl bg-white dark:bg-gray-900 p-8 text-center space-y-4 sticky top-24">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold">Langkah Selanjutnya?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Anda bisa menutup halaman ini. Kami akan mengirimkan notifikasi jika Robux sudah masuk.
                                </p>
                                <Button variant="outline" className="w-full rounded-xl" asChild>
                                    <Link href="/">Kembali ke Beranda</Link>
                                </Button>
                            </Card>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
