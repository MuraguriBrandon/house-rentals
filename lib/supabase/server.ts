import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

interface ServerClientOptions {
  writableCookies?: boolean
}

export async function createSupabaseServerClient({ writableCookies = false }: ServerClientOptions = {}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  const cookieStore = await cookies()

  const cookieMethods = {
    getAll() {
      return cookieStore.getAll()
    },
    ...(writableCookies && {
      setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    }),
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, { cookies: cookieMethods })
}
