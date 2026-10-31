export interface LandlordProperty {
  id: string
  landlord_id: string
  title: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  available: boolean
  image: string
  tenant_name: string | null
  tenant_phone: string | null
  tenant_email: string | null
  water_bill: number
  billing_month: string | null
  lease_start: string | null
  lease_end: string | null
  last_updated: string
  floor: string
  unit: string
  floor_number: number
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function isValidPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0
}

export function isValidNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0
}
