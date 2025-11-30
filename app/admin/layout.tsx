import AdminNavbar from "@/components/admin/AdminNavbar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <AdminNavbar />
            <main className="flex-1 bg-muted/10">
                {children}
            </main>
        </div>
    )
}
