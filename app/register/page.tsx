import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import RegisterForm from "./RegisterForm"

export default async function RegisterPage() {
    // Server-side session check — instant redirect if already logged in
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        redirect('/')
    }

    return <RegisterForm />
}
