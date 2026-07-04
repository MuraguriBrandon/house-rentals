"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Building, DollarSign, Home, Users, Edit, LogOut, Filter, UserX, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const BILLING_STORAGE_KEY = "renthub-billing-data"

// Generate properties for all 8 floors with 10 units each
const generateInitialProperties = () => {
  const properties = []
  const unitTypes = [
    { type: "Bedsitter", bedrooms: 0, bathrooms: 1, price: 9500 },
    { type: "One-Bedroom", bedrooms: 1, bathrooms: 1, price: 16000 },
    { type: "Two-Bedroom", bedrooms: 2, bathrooms: 2, price: 23000 },
    { type: "Three-Bedroom", bedrooms: 3, bathrooms: 2, price: 28000 },
  ]

  const tenantNames = [
    "John Mwangi",
    "Sarah Wanjiku",
    "Mike Ochieng",
    "Grace Njeri",
    "Peter Kamau",
    "Mary Akinyi",
    "David Kiprop",
    "Jane Wambui",
    "Samuel Otieno",
    "Lucy Muthoni",
    "James Kiprotich",
    "Ann Wairimu",
    "Robert Macharia",
    "Faith Chebet",
    "Daniel Mwangi",
    "Alice Wanjiru",
    "Paul Kiptoo",
    "Rose Achieng",
    "Francis Maina",
    "Joyce Nyambura",
  ]

  let id = 1
  for (let floor = 1; floor <= 8; floor++) {
    for (let unit = 1; unit <= 10; unit++) {
      // Distribute unit types across floors
      let unitTypeIndex
      if (floor <= 2) {
        unitTypeIndex = 0 // Bedsitters on floors 1-2
      } else if (floor <= 4) {
        unitTypeIndex = 1 // One-bedroom on floors 3-4
      } else if (floor <= 6) {
        unitTypeIndex = 2 // Two-bedroom on floors 5-6
      } else {
        unitTypeIndex = 3 // Three-bedroom on floors 7-8
      }

      const unitType = unitTypes[unitTypeIndex]
      const unitLetter = String.fromCharCode(64 + unit) // A, B, C, etc.
      const unitNumber = `${unitLetter}${floor}${unit.toString().padStart(2, "0")}`
      const isAvailable = Math.random() > 0.4 // 60% chance of being available

      properties.push({
        id: id++,
        title: `Unit ${unitNumber} - ${unitType.type}`,
        address: "Greenview Apartments, Kileleshwa, Nairobi",
        price: unitType.price,
        bedrooms: unitType.bedrooms,
        bathrooms: unitType.bathrooms,
        available: isAvailable,
        image: "/placeholder.svg?height=100&width=150",
        tenant: isAvailable ? null : tenantNames[Math.floor(Math.random() * tenantNames.length)],
        tenantPhone: isAvailable
          ? null
          : `+254 7${Math.floor(Math.random() * 100000000)
              .toString()
              .padStart(8, "0")}`,
        tenantEmail: isAvailable
          ? null
          : `${tenantNames[Math.floor(Math.random() * tenantNames.length)].toLowerCase().replace(" ", ".")}@email.com`,
        waterBill: isAvailable ? 0 : 1200 + Math.floor(Math.random() * 600),
        billingMonth: "2026-07",
        leaseStart: isAvailable
          ? null
          : new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
              .toISOString()
              .split("T")[0],
        leaseEnd: isAvailable
          ? null
          : new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
              .toISOString()
              .split("T")[0],
        lastUpdated: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString().split("T")[0],
        floor:
          floor === 1
            ? "Ground Floor"
            : floor === 8
              ? `8th Floor (Top)`
              : `${floor}${floor === 2 ? "nd" : floor === 3 ? "rd" : "th"} Floor`,
        unit: unitNumber,
        floorNumber: floor,
      })
    }
  }

  return properties
}

export default function AdminDashboard() {
  const [properties, setProperties] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(BILLING_STORAGE_KEY)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return generateInitialProperties()
        }
      }
    }

    return generateInitialProperties()
  })
  const [editingProperty, setEditingProperty] = useState<any>(null)
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

  const availableCount = properties.filter((p) => p.available).length
  const occupiedCount = properties.filter((p) => !p.available).length
  const totalRevenue = properties.filter((p) => !p.available).reduce((sum, p) => sum + p.price, 0)

  useEffect(() => {
    window.localStorage.setItem(BILLING_STORAGE_KEY, JSON.stringify(properties))
  }, [properties])

  const filteredProperties = properties.filter((property) => {
    const matchesFloor = floorFilter === "all" || property.floorNumber.toString() === floorFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" && property.available) ||
      (statusFilter === "occupied" && !property.available)

    return matchesFloor && matchesStatus
  })

  const handleEditProperty = (property: any) => {
    setEditingProperty(property)
    setNewPrice(property.price.toString())
    setNewStatus(property.available ? "available" : "occupied")
    setNewTenant(property.tenant || "")
    setNewTenantPhone(property.tenantPhone || "")
    setNewTenantEmail(property.tenantEmail || "")
    setNewWaterBill(property.waterBill?.toString() || "0")
    setNewBillingMonth(property.billingMonth || "2026-07")
  }

  const handleSaveChanges = () => {
    if (editingProperty) {
      const isAvailable = newStatus === "available"
      setProperties(
        properties.map((p) =>
          p.id === editingProperty.id
            ? {
                ...p,
                price: Number.parseInt(newPrice),
                available: isAvailable,
                tenant: isAvailable ? null : newTenant || null,
                tenantPhone: isAvailable ? null : newTenantPhone || null,
                tenantEmail: isAvailable ? null : newTenantEmail || null,
                waterBill: isAvailable ? 0 : Number.parseInt(newWaterBill) || 0,
                billingMonth: isAvailable ? "" : newBillingMonth || "2026-07",
                leaseStart: isAvailable ? null : p.leaseStart,
                leaseEnd: isAvailable ? null : p.leaseEnd,
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : p,
        ),
      )
      setEditingProperty(null)
      setNewPrice("")
      setNewStatus("")
      setNewTenant("")
      setNewTenantPhone("")
      setNewTenantEmail("")
      setNewWaterBill("")
      setNewBillingMonth("")
    }
  }

  const handleRemoveTenant = (propertyId: number) => {
    setProperties(
      properties.map((p) =>
        p.id === propertyId
          ? {
              ...p,
              available: true,
              tenant: null,
              tenantPhone: null,
              tenantEmail: null,
              leaseStart: null,
              leaseEnd: null,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : p,
      ),
    )
  }

  const handleAddHouse = () => {
    if (!newHouseTitle || !newHouseUnit || !newHousePrice) return

    const newProperty = {
      id: Date.now(),
      title: newHouseTitle,
      address: "Greenview Apartments, Kileleshwa, Nairobi",
      price: Number.parseInt(newHousePrice),
      bedrooms: 1,
      bathrooms: 1,
      available: true,
      image: "/placeholder.svg?height=100&width=150",
      tenant: null,
      tenantPhone: null,
      tenantEmail: null,
      leaseStart: null,
      leaseEnd: null,
      lastUpdated: new Date().toISOString().split("T")[0],
      floor: "Newly Added",
      unit: newHouseUnit,
      floorNumber: 9,
      waterBill: 0,
      billingMonth: "2026-07",
    }

    setProperties([newProperty, ...properties])
    setNewHouseTitle("")
    setNewHouseUnit("")
    setNewHousePrice("")
    setShowAddHouse(false)
  }

  const handleRemoveHouse = (propertyId: number) => {
    setProperties(properties.filter((property) => property.id !== propertyId))
  }

  const handleLogout = () => {
    window.location.href = "/admin"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Building className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RentHub Admin
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/submissions" className="text-gray-600 hover:text-gray-900">
                Applications
              </Link>
              <Link href="/admin/move-out-requests" className="text-gray-600 hover:text-gray-900">
                Move-Out Requests
              </Link>
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                View Site
              </Link>
              <Button variant="outline" onClick={() => setShowAddHouse((prev) => !prev)}>
                Add House
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showAddHouse && (
          <Card className="mb-8 bg-white/90 shadow-xl border border-white/20">
            <CardHeader>
              <CardTitle>Add a new house</CardTitle>
              <CardDescription>Create a new unit entry for the property list.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="newHouseTitle">House title</Label>
                <Input id="newHouseTitle" value={newHouseTitle} onChange={(e) => setNewHouseTitle(e.target.value)} placeholder="Unit A201 - One-Bedroom" />
              </div>
              <div>
                <Label htmlFor="newHouseUnit">Unit number</Label>
                <Input id="newHouseUnit" value={newHouseUnit} onChange={(e) => setNewHouseUnit(e.target.value)} placeholder="A201" />
              </div>
              <div>
                <Label htmlFor="newHousePrice">Monthly rent</Label>
                <Input id="newHousePrice" type="number" value={newHousePrice} onChange={(e) => setNewHousePrice(e.target.value)} placeholder="16000" />
              </div>
            </CardContent>
            <CardContent className="flex justify-end gap-2 pt-0">
              <Button variant="outline" onClick={() => setShowAddHouse(false)}>Cancel</Button>
              <Button onClick={handleAddHouse}>Save House</Button>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Home className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                {properties.length}
              </div>
              <p className="text-xs text-muted-foreground">8 floors • 10 units per floor</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 group-hover:scale-105 transition-transform">
                {availableCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {((availableCount / properties.length) * 100).toFixed(1)}% vacancy rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupied</CardTitle>
              <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 group-hover:scale-105 transition-transform">
                {occupiedCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {((occupiedCount / properties.length) * 100).toFixed(1)}% occupancy rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                Ksh {totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">From {occupiedCount} occupied units</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl mb-8 border border-white/20">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <Select value={floorFilter} onValueChange={setFloorFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Floors</SelectItem>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((floor) => (
                  <SelectItem key={floor} value={floor.toString()}>
                    Floor {floor} {floor === 1 ? "(Ground)" : floor === 8 ? "(Top)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
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

        {/* Properties Management */}
        <Card className="bg-white/90 backdrop-blur-md shadow-2xl border border-white/20 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-white/20">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Unit Management - Greenview Apartments
            </CardTitle>
            <CardDescription className="text-gray-600">
              Manage all 80 rental units across 8 floors, update prices, track availability, and manage tenants
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto max-h-96">
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
                          <Image
                            src={property.image || "/placeholder.svg"}
                            alt={property.title}
                            width={40}
                            height={30}
                            className="rounded object-cover"
                          />
                          <div>
                            <div className="font-medium text-sm">{property.unit}</div>
                            <div className="text-xs text-gray-500">
                              {property.bedrooms === 0 ? "Bedsitter" : `${property.bedrooms}BR`} • {property.bathrooms}{" "}
                              bath
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{property.floor}</TableCell>
                      <TableCell className="text-sm">
                        {property.bedrooms === 0
                          ? "Bedsitter"
                          : property.bedrooms === 1
                            ? "One-Bedroom"
                            : property.bedrooms === 2
                              ? "Two-Bedroom"
                              : "Three-Bedroom"}
                      </TableCell>
                      <TableCell className="font-medium text-sm">Ksh {property.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={property.available ? "default" : "secondary"}
                          className={`text-xs ${
                            property.available ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          {property.available ? "Available" : "Occupied"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {property.tenant ? (
                          <div>
                            <div className="font-medium">{property.tenant}</div>
                            <div className="text-xs text-gray-500">{property.tenantPhone}</div>
                          </div>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-gray-500">{property.lastUpdated}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProperty(property)}
                                className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 text-xs"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Edit Unit {editingProperty?.unit}</DialogTitle>
                                <DialogDescription>
                                  Update the price, availability status, and tenant information for{" "}
                                  {editingProperty?.title}
                                </DialogDescription>
                              </DialogHeader>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="price">Monthly Rent (Ksh)</Label>
                                    <Input
                                      id="price"
                                      type="number"
                                      value={newPrice}
                                      onChange={(e) => setNewPrice(e.target.value)}
                                      placeholder="Enter monthly rent"
                                    />
                                  </div>

                                  <div>
                                    <Label htmlFor="status">Availability Status</Label>
                                    <Select value={newStatus} onValueChange={setNewStatus}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="available">Available</SelectItem>
                                        <SelectItem value="occupied">Occupied</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                {newStatus === "occupied" && (
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="tenant">Tenant Name</Label>
                                      <Input
                                        id="tenant"
                                        value={newTenant}
                                        onChange={(e) => setNewTenant(e.target.value)}
                                        placeholder="Enter tenant name"
                                      />
                                    </div>

                                    <div>
                                      <Label htmlFor="tenantPhone">Tenant Phone</Label>
                                      <Input
                                        id="tenantPhone"
                                        value={newTenantPhone}
                                        onChange={(e) => setNewTenantPhone(e.target.value)}
                                        placeholder="+254 700 000 000"
                                      />
                                    </div>

                                    <div>
                                      <Label htmlFor="tenantEmail">Tenant Email</Label>
                                      <Input
                                        id="tenantEmail"
                                        type="email"
                                        value={newTenantEmail}
                                        onChange={(e) => setNewTenantEmail(e.target.value)}
                                        placeholder="tenant@email.com"
                                      />
                                    </div>

                                    <div>
                                      <Label htmlFor="waterBill">Water Bill (Ksh)</Label>
                                      <Input
                                        id="waterBill"
                                        type="number"
                                        value={newWaterBill}
                                        onChange={(e) => setNewWaterBill(e.target.value)}
                                        placeholder="Enter water bill"
                                      />
                                    </div>

                                    <div>
                                      <Label htmlFor="billingMonth">Billing Month</Label>
                                      <Input
                                        id="billingMonth"
                                        value={newBillingMonth}
                                        onChange={(e) => setNewBillingMonth(e.target.value)}
                                        placeholder="2026-07"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>

                              <DialogFooter>
                                <Button variant="outline" onClick={() => setEditingProperty(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleSaveChanges}>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 text-xs"
                            onClick={() => handleRemoveHouse(property.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>

                          {!property.available && property.tenant && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 text-xs"
                                >
                                  <UserX className="h-3 w-3 mr-1" />
                                  Remove
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center gap-2">
                                    <Trash2 className="h-5 w-5 text-red-600" />
                                    Remove Tenant from Unit {property.unit}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="space-y-2">
                                    <p>
                                      Are you sure you want to remove <strong>{property.tenant}</strong> from this unit?
                                    </p>
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                                      <p className="text-sm text-yellow-800">
                                        <strong>This action will:</strong>
                                      </p>
                                      <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                                        <li>• Mark the unit as available</li>
                                        <li>• Remove all tenant information</li>
                                        <li>• Clear lease dates</li>
                                        <li>• Update the last modified date</li>
                                      </ul>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-3">
                                      <strong>Unit Details:</strong>
                                      <br />
                                      {property.title}
                                      <br />
                                      {property.floor}
                                      <br />
                                      Ksh {property.price.toLocaleString()}/month
                                    </p>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleRemoveTenant(property.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    Remove Tenant
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
