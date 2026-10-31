"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Building,
  DollarSign,
  Edit,
  Filter,
  Home,
  LogOut,
  Trash2,
  UserX,
  Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { LandlordProperty } from "@/lib/landlord-properties"
import { isRecord } from "@/lib/landlord-properties"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface LandlordDashboardProps {
  initialProperties: LandlordProperty[]
}

interface PropertyResponse {
  property: LandlordProperty
}

async function request<T>(url: string, method: string, body?: Record<string, unknown>): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    const message = isRecord(payload) && typeof payload.error === "string"
      ? payload.error
      : `Request failed (${response.status}).`
    throw new Error(message)
  }

  return payload as T
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "The request failed. Please try again."
}

export function LandlordAccessDenied() {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [error, setError] = useState("")

  const handleSignOut = async () => {
    setIsSigningOut(true)
    let signOutError: Error | null = null
    try {
      const { error } = await getSupabaseBrowserClient().auth.signOut()
      signOutError = error
    } catch (clientError) {
      setError(getErrorMessage(clientError))
      setIsSigningOut(false)
      return
    }
    if (signOutError) {
      setError("Could not sign out. Please try again.")
      setIsSigningOut(false)
      return
    }
    router.replace("/landlord/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white/90 shadow-xl border border-white/20">
        <CardHeader>
          <CardTitle>Landlord access required</CardTitle>
          <CardDescription>
            This signed-in account has not been enabled for the landlord dashboard. Contact the property administrator.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap justify-end gap-2">
          {error ? <p role="alert" className="w-full text-sm text-red-600">{error}</p> : null}
          <Button variant="outline" onClick={handleSignOut} disabled={isSigningOut}>
            {isSigningOut ? "Signing out..." : "Sign out"}
          </Button>
          <Button asChild><Link href="/">Back to website</Link></Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LandlordDashboard({ initialProperties }: LandlordDashboardProps) {
  const router = useRouter()
  const [properties, setProperties] = useState(initialProperties)
  const [editingProperty, setEditingProperty] = useState<LandlordProperty | null>(null)
  const [newPrice, setNewPrice] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [newTenant, setNewTenant] = useState("")
  const [newTenantPhone, setNewTenantPhone] = useState("")
  const [newTenantEmail, setNewTenantEmail] = useState("")
  const [newWaterBill, setNewWaterBill] = useState("")
  const [newBillingMonth, setNewBillingMonth] = useState("")
  const [newHouseTitle, setNewHouseTitle] = useState("")
  const [newHouseUnit, setNewHouseUnit] = useState("")
  const [newHousePrice, setNewHousePrice] = useState("")
  const [showAddHouse, setShowAddHouse] = useState(false)
  const [floorFilter, setFloorFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const availableCount = properties.filter((property) => property.available).length
  const occupiedCount = properties.length - availableCount
  const totalRevenue = properties
    .filter((property) => !property.available)
    .reduce((sum, property) => sum + property.price, 0)
  const filteredProperties = properties.filter((property) => {
    const matchesFloor = floorFilter === "all" || property.floor_number.toString() === floorFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" && property.available) ||
      (statusFilter === "occupied" && !property.available)
    return matchesFloor && matchesStatus
  })
  const floors = [...new Set(properties.map((property) => property.floor_number))].sort((a, b) => a - b)

  const handleEditProperty = (property: LandlordProperty) => {
    setError("")
    setEditingProperty(property)
    setNewPrice(property.price.toString())
    setNewStatus(property.available ? "available" : "occupied")
    setNewTenant(property.tenant_name || "")
    setNewTenantPhone(property.tenant_phone || "")
    setNewTenantEmail(property.tenant_email || "")
    setNewWaterBill(property.water_bill.toString())
    setNewBillingMonth(property.billing_month || "")
  }

  const handleSaveChanges = async () => {
    if (!editingProperty) return

    setError("")
    setIsSaving(true)
    try {
      const { property } = await request<PropertyResponse>(
        `/api/landlord/properties/${encodeURIComponent(editingProperty.id)}`,
        "PATCH",
        {
          price: Number(newPrice),
          available: newStatus === "available",
          tenant_name: newStatus === "available" ? null : newTenant,
          tenant_phone: newStatus === "available" ? null : newTenantPhone,
          tenant_email: newStatus === "available" ? null : newTenantEmail,
          water_bill: newStatus === "available" ? 0 : Number(newWaterBill),
          billing_month: newStatus === "available" ? null : newBillingMonth || null,
        },
      )
      setProperties((current) => current.map((item) => item.id === property.id ? property : item))
      setEditingProperty(null)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddHouse = async () => {
    setError("")
    setIsSaving(true)
    try {
      const { property } = await request<PropertyResponse>("/api/landlord/properties", "POST", {
        title: newHouseTitle,
        unit: newHouseUnit,
        price: Number(newHousePrice),
      })
      setProperties((current) => [property, ...current])
      setNewHouseTitle("")
      setNewHouseUnit("")
      setNewHousePrice("")
      setShowAddHouse(false)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveHouse = async (propertyId: string) => {
    setError("")
    setIsSaving(true)
    try {
      await request<{ success: boolean }>(
        `/api/landlord/properties/${encodeURIComponent(propertyId)}`,
        "DELETE",
      )
      setProperties((current) => current.filter((property) => property.id !== propertyId))
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveTenant = async (property: LandlordProperty) => {
    setError("")
    setIsSaving(true)
    try {
      const { property: updatedProperty } = await request<PropertyResponse>(
        `/api/landlord/properties/${encodeURIComponent(property.id)}`,
        "PATCH",
        {
          available: true,
          tenant_name: null,
          tenant_phone: null,
          tenant_email: null,
          water_bill: 0,
          billing_month: null,
          lease_start: null,
          lease_end: null,
        },
      )
      setProperties((current) => current.map((item) => item.id === property.id ? updatedProperty : item))
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    setError("")
    let signOutError: Error | null = null
    try {
      const { error } = await getSupabaseBrowserClient().auth.signOut()
      signOutError = error
    } catch (clientError) {
      setError(getErrorMessage(clientError))
      return
    }
    if (signOutError) {
      setError("Could not sign out. Please try again.")
      return
    }
    router.replace("/landlord/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/90 shadow-xl backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-2">
                <Building className="h-6 w-6 text-white" />
              </div>
              <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                RentHub Landlord
              </h1>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">View Site</Link>
              <Button variant="outline" onClick={() => setShowAddHouse((current) => !current)}>
                Add House
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error ? <p role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}

        {showAddHouse && (
          <Card className="mb-8 border border-white/20 bg-white/90 shadow-xl">
            <CardHeader>
              <CardTitle>Add a new house</CardTitle>
              <CardDescription>Create a new unit entry in your property list.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="newHouseTitle">House title</Label>
                <Input id="newHouseTitle" value={newHouseTitle} onChange={(event) => setNewHouseTitle(event.target.value)} placeholder="Unit A201 - One-Bedroom" />
              </div>
              <div>
                <Label htmlFor="newHouseUnit">Unit number</Label>
                <Input id="newHouseUnit" value={newHouseUnit} onChange={(event) => setNewHouseUnit(event.target.value)} placeholder="A201" />
              </div>
              <div>
                <Label htmlFor="newHousePrice">Monthly rent</Label>
                <Input id="newHousePrice" type="number" min="1" value={newHousePrice} onChange={(event) => setNewHousePrice(event.target.value)} placeholder="16000" />
              </div>
            </CardContent>
            <CardContent className="flex justify-end gap-2 pt-0">
              <Button variant="outline" onClick={() => setShowAddHouse(false)} disabled={isSaving}>Cancel</Button>
              <Button onClick={handleAddHouse} disabled={isSaving}>{isSaving ? "Saving..." : "Save House"}</Button>
            </CardContent>
          </Card>
        )}

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card className="group border border-white/20 bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
              <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-2"><Home className="h-4 w-4 text-white" /></div>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent transition-transform group-hover:scale-105">{properties.length}</div>
              <p className="text-xs text-muted-foreground">Your rental units</p>
            </CardContent>
          </Card>

          <Card className="group border border-white/20 bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <div className="rounded-lg bg-gradient-to-r from-green-500 to-blue-500 p-2"><Users className="h-4 w-4 text-white" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 transition-transform group-hover:scale-105">{availableCount}</div>
              <p className="text-xs text-muted-foreground">{properties.length ? ((availableCount / properties.length) * 100).toFixed(1) : "0.0"}% vacancy rate</p>
            </CardContent>
          </Card>

          <Card className="group border border-white/20 bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupied</CardTitle>
              <div className="rounded-lg bg-gradient-to-r from-red-500 to-pink-500 p-2"><Users className="h-4 w-4 text-white" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 transition-transform group-hover:scale-105">{occupiedCount}</div>
              <p className="text-xs text-muted-foreground">{properties.length ? ((occupiedCount / properties.length) * 100).toFixed(1) : "0.0"}% occupancy rate</p>
            </CardContent>
          </Card>

          <Card className="group border border-white/20 bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <div className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-2"><DollarSign className="h-4 w-4 text-white" /></div>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent transition-transform group-hover:scale-105">Ksh {totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From {occupiedCount} occupied units</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8 rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Filter className="h-5 w-5 shrink-0 text-gray-500" />
            <Select value={floorFilter} onValueChange={setFloorFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by Floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Floors</SelectItem>
                {floors.map((floor) => <SelectItem key={floor} value={floor.toString()}>{floor === 9 ? "Newly Added" : `Floor ${floor}`}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Units</SelectItem>
                <SelectItem value="available">Available Only</SelectItem>
                <SelectItem value="occupied">Occupied Only</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-600">
              Showing {filteredProperties.length} of {properties.length} units
            </div>
          </div>
        </div>

        <Card className="overflow-hidden rounded-2xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-md">
          <CardHeader className="border-b border-white/20 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
              Unit Management - Your Properties
            </CardTitle>
            <CardDescription className="text-gray-600">
              Manage your rental units, update prices, track availability, and manage your tenants
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white/95 backdrop-blur-sm">
                  <TableRow>
                    <TableHead>Unit</TableHead>
                    <TableHead>Floor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => (
                    <TableRow key={property.id} className="hover:bg-blue-50/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Image src={property.image || "/placeholder.svg"} alt={property.title} width={40} height={30} className="rounded object-cover" />
                          <div>
                            <div className="text-sm font-medium">{property.unit}</div>
                            <div className="text-xs text-gray-500">{property.bedrooms === 0 ? "Bedsitter" : `${property.bedrooms}BR`} • {property.bathrooms} bath</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{property.floor}</TableCell>
                      <TableCell className="text-sm">
                        {property.bedrooms === 0 ? "Bedsitter" : property.bedrooms === 1 ? "One-Bedroom" : property.bedrooms === 2 ? "Two-Bedroom" : "Three-Bedroom"}
                      </TableCell>
                      <TableCell className="text-sm font-medium">Ksh {property.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={property.available ? "default" : "secondary"} className={`text-xs ${property.available ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}>
                          {property.available ? "Available" : "Occupied"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {property.tenant_name ? (
                          <div>
                            <div className="font-medium">{property.tenant_name}</div>
                            <div className="text-xs text-gray-500">{property.tenant_phone}</div>
                          </div>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-xs text-gray-500">{property.last_updated}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog open={editingProperty?.id === property.id} onOpenChange={(open) => { if (!open) setEditingProperty(null) }}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => handleEditProperty(property)} className="border-blue-200 text-xs text-blue-600 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50" disabled={isSaving}>
                                <Edit className="mr-1 h-3 w-3" />Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Unit {editingProperty?.unit}</DialogTitle>
                                <DialogDescription>Update the price, availability status, and tenant information for {editingProperty?.title}</DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2">
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor={`price-${property.id}`}>Monthly Rent (Ksh)</Label>
                                    <Input id={`price-${property.id}`} type="number" min="1" value={newPrice} onChange={(event) => setNewPrice(event.target.value)} placeholder="Enter monthly rent" />
                                  </div>
                                  <div>
                                    <Label htmlFor={`status-${property.id}`}>Availability Status</Label>
                                    <Select value={newStatus} onValueChange={setNewStatus}>
                                      <SelectTrigger id={`status-${property.id}`}><SelectValue placeholder="Select status" /></SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="available">Available</SelectItem>
                                        <SelectItem value="occupied">Occupied</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                {newStatus === "occupied" && (
                                  <div className="space-y-4">
                                    <div><Label htmlFor={`tenant-${property.id}`}>Tenant Name</Label><Input id={`tenant-${property.id}`} value={newTenant} onChange={(event) => setNewTenant(event.target.value)} placeholder="Enter tenant name" /></div>
                                    <div><Label htmlFor={`tenantEmail-${property.id}`}>Tenant Email</Label><Input id={`tenantEmail-${property.id}`} type="email" value={newTenantEmail} onChange={(event) => setNewTenantEmail(event.target.value)} placeholder="tenant@email.com" /></div>
                                    <div><Label htmlFor={`waterBill-${property.id}`}>Water Bill (Ksh)</Label><Input id={`waterBill-${property.id}`} type="number" min="0" value={newWaterBill} onChange={(event) => setNewWaterBill(event.target.value)} placeholder="Enter water bill" /></div>
                                    <div><Label htmlFor={`billingMonth-${property.id}`}>Billing Month</Label><Input id={`billingMonth-${property.id}`} value={newBillingMonth} onChange={(event) => setNewBillingMonth(event.target.value)} placeholder="YYYY-MM" /></div>
                                  </div>
                                )}
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setEditingProperty(null)} disabled={isSaving}>Cancel</Button>
                                <Button onClick={handleSaveChanges} disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Button variant="outline" size="sm" className="border-red-200 text-xs text-red-600 transition-all duration-300 hover:border-red-300 hover:bg-red-50" onClick={() => handleRemoveHouse(property.id)} disabled={isSaving}>
                            <Trash2 className="mr-1 h-3 w-3" />Delete
                          </Button>

                          {!property.available && property.tenant_name && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="border-red-200 text-xs text-red-600 transition-all duration-300 hover:border-red-300 hover:bg-red-50" disabled={isSaving}>
                                  <UserX className="mr-1 h-3 w-3" />Remove
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center gap-2"><Trash2 className="h-5 w-5 text-red-600" />Remove Tenant from Unit {property.unit}</AlertDialogTitle>
                                  <AlertDialogDescription className="space-y-2">
                                    <p>Are you sure you want to remove <strong>{property.tenant_name}</strong> from this unit?</p>
                                    <div className="mt-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                                      <p className="text-sm text-yellow-800"><strong>This action will:</strong></p>
                                      <ul className="mt-1 space-y-1 text-sm text-yellow-700">
                                        <li>• Mark the unit as available</li>
                                        <li>• Remove all tenant information</li>
                                        <li>• Clear lease dates</li>
                                        <li>• Update the last modified date</li>
                                      </ul>
                                    </div>
                                    <p className="mt-3 text-sm text-gray-600"><strong>Unit Details:</strong><br />{property.title}<br />{property.floor}<br />Ksh {property.price.toLocaleString()}/month</p>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleRemoveTenant(property)} className="bg-red-600 text-white hover:bg-red-700" disabled={isSaving}>Remove Tenant</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredProperties.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="py-10 text-center text-sm text-gray-500">
                        {properties.length === 0 ? "You have no properties yet. Use Add House to create your first unit." : "No units match the selected filters."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
