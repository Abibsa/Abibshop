"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, CreditCard, MapPin, Trash2, Loader2 } from "lucide-react"
import { authService } from "@/services/auth.service"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export default function SettingsPage() {
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Profile State
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [isProfileLoading, setIsProfileLoading] = useState(false)

    // Address State (Mock for now as schema doesn't support it yet)
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [zipCode, setZipCode] = useState("")
    const [isAddressLoading, setIsAddressLoading] = useState(false)

    // Security State
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSecurityLoading, setIsSecurityLoading] = useState(false)

    // Notification State
    const [orderNotif, setOrderNotif] = useState(true)
    const [promoNotif, setPromoNotif] = useState(true)

    // Initialize state
    useEffect(() => {
        const init = async () => {
            try {
                const currentUser = await authService.getCurrentUser()
                if (currentUser) {
                    const profile = await authService.getProfile(currentUser.id)
                    setUser({ ...currentUser, ...profile, name: profile.full_name })

                    setName(profile.full_name || "")
                    setEmail(currentUser.email || "")
                    setPhone(profile.phone || "")

                    // Initialize address with mock data or empty
                    setAddress("")
                    setCity("")
                    setZipCode("")
                }
            } catch (error) {
                console.error("Error loading settings:", error)
            } finally {
                setLoading(false)
            }
        }
        init()
    }, [])

    const handleSaveProfile = async () => {
        setIsProfileLoading(true)
        try {
            if (user) {
                // Update profile in database
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        full_name: name,
                        phone: phone
                    })
                    .eq('id', user.id)

                if (error) throw error

                toast.success("Profil berhasil diperbarui", {
                    description: "Informasi profil Anda telah disimpan."
                })
            }
        } catch (error) {
            console.error("Error updating profile:", error)
            toast.error("Gagal memperbarui profil")
        } finally {
            setIsProfileLoading(false)
        }
    }

    const handleSaveAddress = async () => {
        setIsAddressLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsAddressLoading(false)
        toast.success("Alamat berhasil diperbarui", {
            description: "Alamat pengiriman Anda telah disimpan (Simulasi)."
        })
    }

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Gagal mengubah kata sandi", {
                description: "Konfirmasi kata sandi tidak cocok."
            })
            return
        }

        if (newPassword.length < 6) {
            toast.error("Gagal mengubah kata sandi", {
                description: "Kata sandi baru minimal 6 karakter."
            })
            return
        }

        setIsSecurityLoading(true)
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword })

            if (error) throw error

            // Reset fields
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")

            toast.success("Kata sandi berhasil diubah", {
                description: "Silakan gunakan kata sandi baru untuk login selanjutnya."
            })
        } catch (error: any) {
            toast.error("Gagal mengubah kata sandi", {
                description: error.message
            })
        } finally {
            setIsSecurityLoading(false)
        }
    }

    const handleNotifChange = (type: 'order' | 'promo', value: boolean) => {
        if (type === 'order') setOrderNotif(value)
        else setPromoNotif(value)

        toast.info("Pengaturan notifikasi diperbarui", {
            duration: 2000
        })
    }

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="container py-8 md:py-12 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
                <p className="text-muted-foreground mt-2">
                    Kelola preferensi akun dan pengaturan aplikasi Anda.
                </p>
            </div>

            <div className="grid gap-6">
                {/* Profile Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            <CardTitle>Profil Pengguna</CardTitle>
                        </div>
                        <CardDescription>
                            Perbarui informasi profil dan kontak Anda.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    value={email}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Nomor Telepon</Label>
                                <Input
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    type="tel"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button onClick={handleSaveProfile} disabled={isProfileLoading}>
                            {isProfileLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan Profil
                        </Button>
                    </CardFooter>
                </Card>

                {/* Address Settings (New) */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            <CardTitle>Alamat Pengiriman</CardTitle>
                        </div>
                        <CardDescription>
                            Kelola alamat utama untuk pengiriman pesanan (Segera hadir).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="address">Alamat Lengkap</Label>
                            <Input
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Nama jalan, nomor rumah, RT/RW"
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="city">Kota/Kabupaten</Label>
                                <Input
                                    id="city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="zip">Kode Pos</Label>
                                <Input
                                    id="zip"
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button onClick={handleSaveAddress} disabled={isAddressLoading}>
                            {isAddressLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan Alamat
                        </Button>
                    </CardFooter>
                </Card>

                {/* Notification Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            <CardTitle>Notifikasi</CardTitle>
                        </div>
                        <CardDescription>
                            Atur bagaimana Anda ingin menerima pemberitahuan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Notifikasi Pesanan</Label>
                                <p className="text-sm text-muted-foreground">
                                    Terima update status pesanan via email.
                                </p>
                            </div>
                            <Switch
                                checked={orderNotif}
                                onCheckedChange={(c) => handleNotifChange('order', c)}
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Promo & Penawaran</Label>
                                <p className="text-sm text-muted-foreground">
                                    Dapatkan info promo terbaru dari AbibShop.
                                </p>
                            </div>
                            <Switch
                                checked={promoNotif}
                                onCheckedChange={(c) => handleNotifChange('promo', c)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Security Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <CardTitle>Keamanan</CardTitle>
                        </div>
                        <CardDescription>
                            Kelola kata sandi dan keamanan akun Anda.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="new-password">Kata Sandi Baru</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirm-password">Konfirmasi Kata Sandi</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button
                                variant="outline"
                                onClick={handleChangePassword}
                                disabled={isSecurityLoading || !newPassword}
                            >
                                {isSecurityLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Ubah Kata Sandi
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-200 dark:border-red-900">
                    <CardHeader>
                        <div className="flex items-center gap-2 text-red-600">
                            <Trash2 className="h-5 w-5" />
                            <CardTitle>Zona Bahaya</CardTitle>
                        </div>
                        <CardDescription>
                            Tindakan ini tidak dapat dibatalkan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-red-600">Hapus Akun</Label>
                                <p className="text-sm text-muted-foreground">
                                    Menghapus akun Anda dan semua data terkait secara permanen.
                                </p>
                            </div>
                            <Button variant="destructive">Hapus Akun</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
