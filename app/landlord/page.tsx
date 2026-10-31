import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LandlordDashboard, { LandlordAccessDenied } from "@/components/landlord/landlord-dashboard"
import type { LandlordProperty } from "@/lib/landlord-properties"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function LandlordPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg border border-white/20 bg-white/90 shadow-xl">
          <CardHeader>
            <CardTitle>Landlord authentication is not configured</CardTitle>
            <CardDescription>Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable landlord sign in.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end"><Button asChild><Link href="/">Back to website</Link></Button></CardContent>
        </Card>
      </div>
    )
  }

  const supabase = await createSupabaseServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError && authError.name !== "AuthSessionMissingError" && authError.status !== 401) {
    console.error("Could not verify landlord session", authError)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg border border-white/20 bg-white/90 shadow-xl">
          <CardHeader><CardTitle>Could not verify your session</CardTitle><CardDescription>Please try signing in again.</CardDescription></CardHeader>
          <CardContent className="flex justify-end"><Button asChild><Link href="/landlord/login">Landlord Login</Link></Button></CardContent>
        </Card>
      </div>
    )
  }

  if (!user) redirect("/landlord/login")

  const { data: landlord, error: landlordError } = await supabase
    .from("landlord_profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (landlordError) {
    console.error("Could not verify landlord access", landlordError)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg border border-white/20 bg-white/90 shadow-xl">
          <CardHeader><CardTitle>Could not load landlord access</CardTitle><CardDescription>Please try again later.</CardDescription></CardHeader>
        </Card>
      </div>
    )
  }

  if (!landlord) return <LandlordAccessDenied />

  const { data: properties, error: propertiesError } = await supabase
    .from("landlord_properties")
    .select("*")
    .eq("landlord_id", user.id)
    .order("created_at", { ascending: false })

  if (propertiesError) {
    console.error("Could not load landlord properties", propertiesError)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg border border-white/20 bg-white/90 shadow-xl">
          <CardHeader><CardTitle>Could not load your properties</CardTitle><CardDescription>Please try again later.</CardDescription></CardHeader>
          <CardContent className="flex justify-end"><Button asChild><Link href="/">Back to website</Link></Button></CardContent>
        </Card>
      </div>
    )
  }

  return <LandlordDashboard initialProperties={properties as LandlordProperty[]} />
}
