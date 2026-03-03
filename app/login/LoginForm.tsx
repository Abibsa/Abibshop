"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authService } from "@/services/auth.service"
import { checkUserRole } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, Mail } from "lucide-react"

export default function LoginForm() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const { user } = await authService.signIn(email, password)

            if (user) {
                // Use reliable server-side role check
                const role = await checkUserRole()
                setLoading(false)

                if (role === 'admin') {
                    window.location.href = '/admin'
                } else {
                    window.location.href = '/'
                }
                return; // Stop here to prevent catch from firing if redirect takes time
            }
        } catch (err: any) {
            console.error("Login Error:", err)
            const detail = err.message || ""
            if (detail.includes("unexpected response")) {
                setError("Server Supabase sedang sibuk atau URL salah. Cek Env Vercel (pastikan URL tanpa tanda miring / di ujung).")
            } else {
                setError(detail || "Email atau password salah!")
            }
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-[calc(100vh-200px)] flex items-center justify-center py-10 overflow-hidden">
            {/* Background with gradient mesh */}
            <div className="absolute inset-0 gradient-mesh opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />

            <div className="container relative z-10 px-4">
                <Card className="w-full max-w-md mx-auto border-2 shadow-2xl hover-lift animate-scale-in">
                    <CardHeader className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                            <Lock className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Login
                            </CardTitle>
                            <CardDescription className="text-base mt-2">
                                Masuk ke akun AbibShop Anda
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {error && (
                                <Alert variant="destructive" className="animate-slide-up">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="contoh@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                    <Link
                                        href="/auth/reset-password"
                                        className="text-xs text-primary hover:underline"
                                        prefetch={false}
                                    >
                                        Lupa password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4">
                            <Button
                                type="submit"
                                className="w-full gradient-primary hover:opacity-90 transition-opacity text-base h-11"
                                disabled={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {loading ? "Memproses..." : "Login"}
                            </Button>

                            <p className="text-center text-sm text-muted-foreground">
                                Belum punya akun?{" "}
                                <Link href="/register" className="font-semibold text-primary hover:underline">
                                    Daftar sekarang
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
