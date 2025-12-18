"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, Mail, Sparkles } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Cek jika user sudah login saat buka halaman ini
    useEffect(() => {
        const checkSession = async () => {
            try {
                const user = await authService.getCurrentUser()
                if (user) {
                    router.replace('/') // Auto redirect ke home
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
        setLoading(true)

        try {
            const { user } = await authService.signIn(email, password)

            if (user) {
                // Login sukses! Cek role sebentar
                try {
                    const profile = await authService.getProfile(user.id)
                    if (profile?.role === 'admin') {
                        router.push('/admin')
                        router.refresh()
                        return
                    }
                } catch (e) {
                    console.log("Profile check failed, redirecting to home")
                }

                // Default redirect
                router.push('/')
                router.refresh()
            }
        } catch (err: any) {
            console.error('Login error:', err)
            setError(err.message || "Email atau password salah!")
            setLoading(false) // Stop loading only on error
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
                                        placeholder="azizabib22@gmail.com"
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
                                    />
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    <p className="font-semibold text-sm">Demo Account:</p>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                    <p className="font-mono">Admin: azizabib22@gmail.com</p>
                                    <p className="font-mono text-xs">Password: nmc.jockers</p>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full gradient-primary hover:opacity-90 transition-opacity text-base h-11"
                                disabled={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {loading ? "Memproses..." : "Login"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
