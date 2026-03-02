"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ShoppingCart, User, X } from "lucide-react";
import { toast } from "sonner";

// Data Dummy 2 Pelanggan Asli Pertama
const INITIAL_PURCHASES = [
    {
        name: "Yofie",
        product: "1000 Robux",
        time: "Baru saja",
    },
    {
        name: "Kyun",
        product: "1000 Robux",
        time: "Sekitar 4 menit yang lalu",
    }
];

export function SalesPopup() {
    const [currentPurchase, setCurrentPurchase] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [purchases, setPurchases] = useState<any[]>(INITIAL_PURCHASES);
    const supabase = createClient();

    useEffect(() => {
        // 1. Coba ambil 5 pesanan 'completed' terbaru dari database
        const fetchRecentOrders = async () => {
            const { data } = await supabase
                .from("orders")
                .select("customer_name, product_name, completed_at")
                .eq("status", "completed")
                .order("completed_at", { ascending: false })
                .limit(5);

            if (data && data.length > 0) {
                // Format data dari DB
                const formattedData = data.map((order) => {
                    // Hanya ambil nama pertama atau samarkan
                    const firstName = order.customer_name?.split(" ")[0] || "User";
                    const maskedName = firstName.length > 3
                        ? firstName.substring(0, 3) + "***"
                        : firstName + "***";

                    return {
                        name: maskedName,
                        product: order.product_name,
                        time: "Baru saja", // Real-time
                    };
                });

                // Gabungkan data DB dengan Yofie & Kyun sebagai cadangan
                setPurchases([...formattedData, ...INITIAL_PURCHASES]);
            }
        };

        fetchRecentOrders();

        // 2. Setup The Pop-up Loop
        const getRandomDelay = (min: number, max: number) =>
            Math.floor(Math.random() * (max - min + 1) + min);

        let popupTimeout: NodeJS.Timeout;
        let hideTimeout: NodeJS.Timeout;

        const showNextPopup = () => {
            if (purchases.length === 0) return;

            // Pilih secara acak
            const randomIndex = Math.floor(Math.random() * purchases.length);
            setCurrentPurchase(purchases[randomIndex]);
            setIsVisible(true);

            // Sembunyikan setelah 5 detik
            hideTimeout = setTimeout(() => {
                setIsVisible(false);
                // Munculin lagi di detik ke-15 sampai 30
                popupTimeout = setTimeout(showNextPopup, getRandomDelay(15000, 30000));
            }, 5000);
        };

        // Mulai pop-up pertama setelah 3 detik beban halaman
        popupTimeout = setTimeout(showNextPopup, 3000);

        return () => {
            clearTimeout(popupTimeout);
            clearTimeout(hideTimeout);
        };
    }, [purchases.length, supabase]);

    if (!isVisible || !currentPurchase) return null;

    return (
        <div className="fixed bottom-6 left-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-2xl border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex gap-4 max-w-sm relative">
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                    <X className="w-3 h-3" />
                </button>

                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                    <ShoppingCart className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        <span className="font-extrabold text-blue-600 dark:text-blue-400">{currentPurchase.name}</span> baru saja top-up
                    </p>
                    <p className="text-sm font-bold truncate mt-0.5">{currentPurchase.product}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-green-500" /> Succesful
                        </p>
                        <span className="text-[10px] text-gray-400">• {currentPurchase.time}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
