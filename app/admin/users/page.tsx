"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Shield, User, UserX, UserCheck, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const supabase = createClient();

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Gagal mengambil data user");
        } else {
            setUsers(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUpdateRole = async (userId: string, newRole: string) => {
        try {
            // Note: Updating role of other users usually requires Admin Client or high-privilege RPC
            // In this case, we assume there is an RPC or the admin has enough permissions via RLS
            const { error } = await supabase
                .from("profiles")
                .update({ role: newRole })
                .eq("id", userId);

            if (error) throw error;
            toast.success(`Berhasil mengubah role menjadi ${newRole}`);
            fetchUsers();
        } catch (e: any) {
            toast.error(`Gagal: ${e.message}`);
        }
    };

    const filteredUsers = users.filter(u =>
        u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
                    <p className="text-muted-foreground">Kelola hak akses dan data pengguna AbibShop</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari email atau nama..."
                        className="pl-9 bg-white dark:bg-gray-800"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-gray-900">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                            <TableRow>
                                <TableHead className="py-4">User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        Tidak ada pengguna ditemukan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold">
                                                    {user.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold">{user.full_name || 'No Name'}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className={user.role === 'admin' ? 'bg-purple-100 text-purple-700 hover:bg-purple-100 border-none px-3' : 'px-3'}>
                                                {user.role === 'admin' ? <Shield className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                                                {user.role.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl border-none shadow-xl">
                                                    {user.role === 'admin' ? (
                                                        <DropdownMenuItem onClick={() => handleUpdateRole(user.id, 'user')} className="text-amber-600 focus:text-amber-600 rounded-lg cursor-pointer">
                                                            <User className="w-4 h-4 mr-2" /> Turunkan ke User
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem onClick={() => handleUpdateRole(user.id, 'admin')} className="text-blue-600 focus:text-blue-600 rounded-lg cursor-pointer">
                                                            <Shield className="w-4 h-4 mr-2" /> Angkat ke Admin
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem className="text-red-600 focus:text-red-600 rounded-lg cursor-pointer">
                                                        <UserX className="w-4 h-4 mr-2" /> Ban User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
