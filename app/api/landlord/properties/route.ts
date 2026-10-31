import { NextResponse } from "next/server"
import { getLandlordContext } from "@/lib/supabase/landlord"
import { isRecord, isValidPositiveInteger } from "@/lib/landlord-properties"

export async function GET() {
  const context = await getLandlordContext()
  if ("response" in context) return context.response

  const { data, error } = await context.supabase
    .from("landlord_properties")
    .select("*")
    .eq("landlord_id", context.landlordId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Could not load landlord properties", error)
    return NextResponse.json({ error: "Could not load your properties." }, { status: 500 })
  }

  return NextResponse.json({ properties: data })
}

export async function POST(request: Request) {
  const context = await getLandlordContext()
  if ("response" in context) return context.response

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 })
  }

  if (
    !isRecord(body) ||
    typeof body.title !== "string" ||
    !body.title.trim() ||
    body.title.trim().length > 150 ||
    typeof body.unit !== "string" ||
    !body.unit.trim() ||
    body.unit.trim().length > 30 ||
    !isValidPositiveInteger(body.price)
  ) {
    return NextResponse.json({ error: "Enter a house title, unit number, and valid monthly rent." }, { status: 400 })
  }

  const { data, error } = await context.supabase
    .from("landlord_properties")
    .insert({
      landlord_id: context.landlordId,
      title: body.title.trim(),
      unit: body.unit.trim(),
      price: body.price,
      address: "Landlord property",
      bedrooms: 1,
      bathrooms: 1,
      available: true,
      image: "/placeholder.svg?height=100&width=150",
      floor: "Newly Added",
      floor_number: 9,
      tenant_name: null,
      tenant_phone: null,
      tenant_email: null,
      water_bill: 0,
      billing_month: null,
      lease_start: null,
      lease_end: null,
      last_updated: new Date().toISOString().slice(0, 10),
    })
    .select("*")
    .single()

  if (error) {
    console.error("Could not create landlord property", error)
    return NextResponse.json({ error: "Could not create this property." }, { status: 500 })
  }

  return NextResponse.json({ property: data }, { status: 201 })
}
