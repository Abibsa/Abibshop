"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Clock, CheckCircle2, XCircle, ChevronRight, Package, CreditCard } from "lucide-react";
import Link from "next/link";

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchOrders() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = "/login?redirect=/my-orders";
                return;
            }

            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (data) setOrders(data);
            setLoading(false);
        }

        fetchOrders();
    }, [supabase]);

    const getStatusBadge = (status: string, paymentStatus: string) => {
        if (paymentStatus === 'pending') return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Menunggu Pembayaran</Badge>;
        if (status === 'completed') return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Selesai</Badge>;
        if (status === 'processing') return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Diproses</Badge>;
        if (status === 'cancelled' || status === 'failed') return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Gagal/Batal</Badge>;
        return <Badge variant="outline">{status}</Badge>;
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <main className="flex-1 container max-w-5xl mx-auto px-4 py-12 ml-auto mr-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <ShoppingBag className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pesanan Saya</h1>
                        <p className="text-muted-foreground">Riwayat top-up dan pembelian Anda</p>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 w-full rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <Card className="text-center py-16 border-dashed">
                        <CardContent className="space-y-4">
                            <Package className="w-12 h-12 mx-auto text-muted-foreground opacity-20" />
                            <div className="space-y-1">
                                <h3 className="text-xl font-semibold">Belum ada pesanan</h3>
                                <p className="text-muted-foreground">Anda belum pernah melakukan transaksi di AbibShop.</p>
                            </div>
                            <Button asChild className="gradient-primary">
                                <Link href="/products">Mulai Belanja</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {orders.map((order) => (
                            <Link key={order.id} href={`/order/${order.order_number}`}>
                                <Card className="hover:shadow-md transition-all cursor-pointer group border-none shadow-sm overflow-hidden bg-white dark:bg-gray-800">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                                    <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                                {order.payment_status === 'paid' ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <Clock className="w-6 h-6 text-yellow-500" />}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm text-muted-foreground">#{order.order_number}</span>
                                                    {getStatusBadge(order.status, order.payment_status)}
                                                </div>
                                                <h3 className="font-bold text-lg">{order.product_name}</h3>
                                                <p className="text-sm text-muted-foreground">Target: <span className="text-foreground font-medium">{order.game_username}</span></p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:text-right gap-4">
                                            <div className="space-y-1">
                                                <p className="font-bold text-xl text-primary">Rp {Number(order.total_amount).toLocaleString('id-ID')}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
