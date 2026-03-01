"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { authService } from "@/services/auth.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, Mail, ArrowLeft, CheckCircle } from "lucide-react"

type PageMode = "request" | "update" | "success"

export default function ResetPasswordPage() {
    const router = useRouter()
    const supabase = createClient()

    const [mode, setMode] = useState<PageMode>("request")
    const [email, setEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [checkingSession, setCheckingSession] = useState(true)

    // Check if user arrived via password reset link (has access_token in URL hash)
    useEffect(() => {
        const checkResetSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                // If user has a valid session from the reset link, show password update form
                if (session) {
                    setMode("update")
                }
            } catch (e) {
                // No session, show request form
            } finally {
                setCheckingSession(false)
            }
        }

        // Listen for auth events (PASSWORD_RECOVERY)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                setMode("update")
                setCheckingSession(false)
            }
        })

        checkResetSession()

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    // Handle: Request password reset email
    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            await authService.resetPassword(email.trim())
            setMode("success")
        } catch (err: any) {
            setError(err.message || "Gagal mengirim email reset password.")
        } finally {
            setLoading(false)
        }
    }

    // Handle: Set new password
    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (newPassword !== confirmPassword) {
            setError("Password tidak cocok!")
            return
        }
        if (newPassword.length < 6) {
            setError("Password minimal 6 karakter.")
            return
        }

        setLoading(true)
        try {
            await authService.updatePassword(newPassword)
            setMode("success")
            setTimeout(() => router.push("/login"), 2000)
        } catch (err: any) {
            setError(err.message || "Gagal mengubah password.")
        } finally {
            setLoading(false)
        }
    }

    if (checkingSession) {
        return (
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="relative min-h-[calc(100vh-200px)] flex items-center justify-center py-10 overflow-hidden">
            <div className="absolute inset-0 gradient-mesh opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />

            <div className="container relative z-10 px-4">
                <Card className="w-full max-w-md mx-auto border-2 shadow-2xl animate-scale-in">
                    {/* ── Success State ── */}
                    {mode === "success" && (
                        <>
                            <CardHeader className="text-center space-y-4">
                                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        Berhasil!
                                    </CardTitle>
                                    <CardDescription className="text-base mt-2">
                                        {email
                                            ? `Link reset password telah dikirim ke ${email}. Silakan cek inbox atau folder spam Anda.`
                                            : "Password Anda berhasil diubah. Mengalihkan ke halaman login..."
                                        }
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardFooter className="justify-center">
                                <Button asChild variant="outline">
                                    <Link href="/login">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Kembali ke Login
                                    </Link>
                                </Button>
                            </CardFooter>
                        </>
                    )}

                    {/* ── Request Reset Form ── */}
                    {mode === "request" && (
                        <>
                            <CardHeader className="text-center space-y-4">
                                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                                    <Mail className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Lupa Password?
                                    </CardTitle>
                                    <CardDescription className="text-base mt-2">
                                        Masukkan email akun Anda untuk menerima link reset password.
                                    </CardDescription>
                                </div>
                            </CardHeader>

                            <form onSubmit={handleRequestReset}>
                                <CardContent className="space-y-4">
                                    {error && (
                                        <Alert variant="destructive" className="animate-slide-up">
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}
                                    <div className="space-y-2">
                                        <Label htmlFor="reset-email" className="text-sm font-medium">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="reset-email"
                                                type="email"
                                                placeholder="contoh@email.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
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
                                        {loading ? "Mengirim..." : "Kirim Link Reset"}
                                    </Button>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href="/login">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Kembali ke Login
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </form>
                        </>
                    )}

                    {/* ── Update Password Form ── */}
                    {mode === "update" && (
                        <>
                            <CardHeader className="text-center space-y-4">
                                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                                    <Lock className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Password Baru
                                    </CardTitle>
                                    <CardDescription className="text-base mt-2">
                                        Masukkan password baru untuk akun Anda.
                                    </CardDescription>
                                </div>
                            </CardHeader>

                            <form onSubmit={handleUpdatePassword}>
                                <CardContent className="space-y-4">
                                    {error && (
                                        <Alert variant="destructive" className="animate-slide-up">
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}
                                    <div className="space-y-2">
                                        <Label htmlFor="new-password" className="text-sm font-medium">Password Baru</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="new-password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="pl-10"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password" className="text-sm font-medium">Konfirmasi Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="confirm-password"
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
                                        {loading ? "Menyimpan..." : "Simpan Password Baru"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </>
                    )}
                </Card>
            </div>
        </div>
    )
}
