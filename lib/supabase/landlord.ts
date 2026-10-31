import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function getLandlordContext() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      response: NextResponse.json(
        { error: "Landlord authentication is not configured on this server." },
        { status: 503 },
      ),
    }
  }

  const supabase = await createSupabaseServerClient({ writableCookies: true })
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError && authError.name !== "AuthSessionMissingError" && authError.status !== 401) {
    console.error("Could not verify landlord session", authError)
    return { response: NextResponse.json({ error: "Could not verify your session." }, { status: 500 }) }
  }

  if (!user) {
    return { response: NextResponse.json({ error: "Sign in to continue." }, { status: 401 }) }
  }

  const { data: landlord, error: landlordError } = await supabase
    .from("landlord_profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (landlordError) {
    console.error("Could not verify landlord access", landlordError)
    return { response: NextResponse.json({ error: "Could not verify landlord access." }, { status: 500 }) }
  }

  if (!landlord) {
    return { response: NextResponse.json({ error: "Landlord access is not enabled for this account." }, { status: 403 }) }
  }

  return { supabase, landlordId: user.id }
}
