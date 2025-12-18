"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Construction } from "lucide-react"

export default function UsersManagement() {
    return (
        <div className="container py-20 px-4 md:px-6">
            <div className="mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Manajemen Pengguna</h1>
                <p className="text-muted-foreground">Kelola semua pengguna terdaftar di platform</p>
            </div>

            <Card className="border-2 shadow-lg max-w-2xl mx-auto text-center py-10">
                <CardHeader>
                    <div className="mx-auto bg-muted rounded-full p-6 w-24 h-24 flex items-center justify-center mb-4">
                        <Construction className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Fitur Sedang Dalam Pengembangan</CardTitle>
                    <CardDescription className="text-lg mt-2">
                        Modul manajemen pengguna sedang disesuaikan dengan sistem database baru (Supabase).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Silakan gunakan Dashboard Supabase untuk mengelola pengguna secara langsung sementara waktu.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
