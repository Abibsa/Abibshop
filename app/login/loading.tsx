import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function LoginLoading() {
    return (
        <div className="relative min-h-[calc(100vh-200px)] flex items-center justify-center py-10 overflow-hidden">
            <div className="absolute inset-0 gradient-mesh opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />

            <div className="container relative z-10 px-4">
                <Card className="w-full max-w-md mx-auto border-2 shadow-2xl">
                    <CardHeader className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-muted animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-8 w-32 bg-muted rounded-md mx-auto animate-pulse" />
                            <div className="h-4 w-48 bg-muted rounded-md mx-auto animate-pulse" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                            <div className="h-10 bg-muted rounded-md animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                            <div className="h-10 bg-muted rounded-md animate-pulse" />
                        </div>
                        <div className="flex items-center justify-center pt-4">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
