import { NextResponse } from "next/server"
import { isRecord, isValidNonNegativeInteger, isValidPositiveInteger } from "@/lib/landlord-properties"
import { getLandlordContext } from "@/lib/supabase/landlord"

interface RouteContext {
  params: Promise<{ propertyId: string }>
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function PATCH(request: Request, { params }: RouteContext) {
  const context = await getLandlordContext()
  if ("response" in context) return context.response

  const { propertyId } = await params
  if (!uuidPattern.test(propertyId)) {
    return NextResponse.json({ error: "Property not found." }, { status: 404 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 })
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: "Invalid property details." }, { status: 400 })
  }

  const updates: Record<string, string | number | boolean | null> = {}

  if ("price" in body) {
    if (!isValidPositiveInteger(body.price)) {
      return NextResponse.json({ error: "Monthly rent must be a positive whole number." }, { status: 400 })
    }
    updates.price = body.price
  }

  if ("available" in body) {
    if (typeof body.available !== "boolean") {
      return NextResponse.json({ error: "Availability must be true or false." }, { status: 400 })
    }
    updates.available = body.available
  }

  for (const field of ["tenant_name", "tenant_phone", "tenant_email"] as const) {
    if (field in body) {
      const value = body[field]
      if (value !== null && (typeof value !== "string" || value.length > 255)) {
        return NextResponse.json({ error: `Invalid ${field.replace("_", " ")}.` }, { status: 400 })
      }
      if (field === "tenant_email" && typeof value === "string" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return NextResponse.json({ error: "Enter a valid tenant email address." }, { status: 400 })
      }
      updates[field] = value
    }
  }

  for (const field of ["lease_start", "lease_end"] as const) {
    if (field in body) {
      const value = body[field]
      if (value !== null && (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))) {
        return NextResponse.json({ error: `Invalid ${field.replace("_", " ")}.` }, { status: 400 })
      }
      if (typeof value === "string") {
        const parsedDate = Date.parse(`${value}T00:00:00.000Z`)
        if (!Number.isFinite(parsedDate) || new Date(parsedDate).toISOString().slice(0, 10) !== value) {
          return NextResponse.json({ error: `Invalid ${field.replace("_", " ")}.` }, { status: 400 })
        }
      }
      updates[field] = value
    }
  }

  if ("water_bill" in body) {
    if (!isValidNonNegativeInteger(body.water_bill)) {
      return NextResponse.json({ error: "Water bill must be a non-negative whole number." }, { status: 400 })
    }
    updates.water_bill = body.water_bill
  }

  if ("billing_month" in body) {
    if (
      body.billing_month !== null &&
      (typeof body.billing_month !== "string" || !/^\d{4}-(0[1-9]|1[0-2])$/.test(body.billing_month))
    ) {
      return NextResponse.json({ error: "Billing month must use YYYY-MM format." }, { status: 400 })
    }
    updates.billing_month = body.billing_month
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No editable property details were provided." }, { status: 400 })
  }

  const { data: existingProperty, error: ownershipError } = await context.supabase
    .from("landlord_properties")
    .select("id")
    .eq("id", propertyId)
    .eq("landlord_id", context.landlordId)
    .maybeSingle()

  if (ownershipError) {
    console.error("Could not verify property ownership before update", ownershipError)
    return NextResponse.json({ error: "Could not verify property ownership." }, { status: 500 })
  }

  if (!existingProperty) {
    return NextResponse.json({ error: "Property not found." }, { status: 404 })
  }

  updates.last_updated = new Date().toISOString().slice(0, 10)

  const { data, error } = await context.supabase
    .from("landlord_properties")
    .update(updates)
    .eq("id", propertyId)
    .eq("landlord_id", context.landlordId)
    .select("*")
    .single()

  if (error) {
    console.error("Could not update landlord property", error)
    return NextResponse.json({ error: "Could not update this property." }, { status: 500 })
  }

  return NextResponse.json({ property: data })
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const context = await getLandlordContext()
  if ("response" in context) return context.response

  const { propertyId } = await params
  if (!uuidPattern.test(propertyId)) {
    return NextResponse.json({ error: "Property not found." }, { status: 404 })
  }

  const { data: existingProperty, error: ownershipError } = await context.supabase
    .from("landlord_properties")
    .select("id")
    .eq("id", propertyId)
    .eq("landlord_id", context.landlordId)
    .maybeSingle()

  if (ownershipError) {
    console.error("Could not verify property ownership before delete", ownershipError)
    return NextResponse.json({ error: "Could not verify property ownership." }, { status: 500 })
  }

  if (!existingProperty) {
    return NextResponse.json({ error: "Property not found." }, { status: 404 })
  }

  const { error } = await context.supabase
    .from("landlord_properties")
    .delete()
    .eq("id", propertyId)
    .eq("landlord_id", context.landlordId)

  if (error) {
    console.error("Could not delete landlord property", error)
    return NextResponse.json({ error: "Could not delete this property." }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
