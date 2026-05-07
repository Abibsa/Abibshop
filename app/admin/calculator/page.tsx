"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calculator, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { ROBUX_TARGETS, Account, calculate } from "@/lib/calculator"

// Custom hook untuk localStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Load from localStorage after mount (client-side only)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(error)
    }
  }, [key])

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

export default function CalculatorPage() {
  const [accounts, setAccounts] = useLocalStorage<Account[]>("reward-accounts", [])
  const [name, setName] = useState("")
  const [currentPoints, setCurrentPoints] = useState("")
  const [dailyPoints, setDailyPoints] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleAddAccount = () => {
    if (!name.trim() || !currentPoints || !dailyPoints) {
      toast.error("Semua field harus diisi")
      return
    }

    const newAccount: Account = {
      id: Date.now().toString(),
      name: name.trim(),
      currentPoints: parseInt(currentPoints),
      dailyPoints: parseInt(dailyPoints),
    }

    setAccounts([...accounts, newAccount])
    setName("")
    setCurrentPoints("")
    setDailyPoints("")
    toast.success("Akun ditambahkan")
  }

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter((acc) => acc.id !== id))
    toast.success("Akun dihapus")
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Reward Calculator</h1>
        <p className="text-muted-foreground">
          Hitung estimasi waktu untuk mencapai target Robux dari Microsoft Rewards
        </p>
      </div>

      {/* Form Tambah Akun */}
      <Card className="border-2 shadow-lg mb-6">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Tambah Akun
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Nama akun"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Poin saat ini"
              value={currentPoints}
              onChange={(e) => setCurrentPoints(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Poin per hari"
              value={dailyPoints}
              onChange={(e) => setDailyPoints(e.target.value)}
            />
            <Button onClick={handleAddAccount} className="gradient-primary">
              Tambah Akun
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hasil Kalkulasi */}
      {!isMounted ? (
        <Card className="border-2 shadow-lg">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <Calculator className="h-16 w-16 text-muted-foreground mb-4 animate-pulse" />
              <p className="text-muted-foreground text-lg">Loading...</p>
            </div>
          </CardContent>
        </Card>
      ) : accounts.length === 0 ? (
        <Card className="border-2 shadow-lg">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <Calculator className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                Belum ada akun. Tambahkan akun di atas.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account) => (
            <Card key={account.id} className="border-2 shadow-lg animate-slide-up">
              <CardHeader className="border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle>{account.name}</CardTitle>
                    <Badge variant="outline">
                      {account.currentPoints.toLocaleString()} pts
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-red-100 dark:hover:bg-red-900/20"
                    onClick={() => handleDeleteAccount(account.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {ROBUX_TARGETS.map((target) => {
                  const result = calculate(account, target)
                  return (
                    <div key={target.robux} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">
                          Target: {target.robux} Robux
                        </h3>
                        {result.isReady ? (
                          <Badge variant="default" className="bg-green-600">
                            Siap Redeem! 🎉
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            {result.daysNeeded} hari lagi
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Estimasi:{" "}
                        {format(result.estimatedDate, "dd MMMM yyyy", {
                          locale: localeId,
                        })}
                      </p>
                      <Progress value={result.percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground text-right">
                        {result.percentage}% ({account.currentPoints.toLocaleString()} /{" "}
                        {target.points.toLocaleString()} pts)
                      </p>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
