"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authService } from "@/services/auth.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, Mail, User } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter()
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    // Cek jika user sudah login
    useEffect(() => {
        const checkSession = async () => {
            try {
                const user = await authService.getCurrentUser()
                if (user) {
                    router.replace('/')
                }
            } catch (e) {
                // No session, stay here
            }
        }
        checkSession()
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess(false)

        if (password !== confirmPassword) {
            setError("Password tidak cocok!")
            return
        }

        if (password.length < 6) {
            setError("Password minimal 6 karakter")
            return
        }

        setLoading(true)

        try {
            await authService.signUp(email.trim(), password, fullName.trim())
            setSuccess(true)
            // Bisa redirect setelah delay atau biarkan user baca pesan
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        } catch (err: any) {
            console.error('Register error:', err)
            let message = err.message || "Gagal mendaftar. Silakan coba lagi.";

            // Translate common errors
            if (message.toLowerCase().includes("email address") && message.toLowerCase().includes("is invalid")) {
                message = "Email tidak valid. Pastikan format benar dan domain diizinkan.";
            } else if (message.includes("User already registered")) {
                message = "Email sudah terdaftar. Silakan login.";
            } else if (message.includes("Password should be at least")) {
                message = "Password terlalu pendek.";
            }

            setError(message)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="relative min-h-[calc(100vh-200px)] flex items-center justify-center py-10 overflow-hidden">
                <div className="absolute inset-0 gradient-mesh opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />

                <div className="container relative z-10 px-4">
                    <Card className="w-full max-w-md mx-auto border-2 shadow-2xl animate-scale-in text-center">
                        <CardHeader>
                            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                                <User className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">Pendaftaran Berhasil!</CardTitle>
                            <CardDescription>
                                Akun Anda telah dibuat. Mengalihkan ke halaman login...
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="justify-center">
                            <Button asChild variant="outline">
                                <Link href="/login">Login Sekarang</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        )
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
                            <User className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Daftar Akun
                            </CardTitle>
                            <CardDescription className="text-base mt-2">
                                Buat akun baru di AbibShop
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
                                <Label htmlFor="fullName" className="text-sm font-medium">Nama Lengkap</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="Nama Lengkap Anda"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

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
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
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
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium">Konfirmasi Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pl-10"
                                        required
                                        minLength={6}
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
                                {loading ? "Mendaftar..." : "Daftar Sekarang"}
                            </Button>

                            <p className="text-center text-sm text-muted-foreground">
                                Sudah punya akun?{" "}
                                <Link href="/login" className="font-semibold text-primary hover:underline">
                                    Login disini
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
