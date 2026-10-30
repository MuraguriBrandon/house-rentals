"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Building, CheckCircle2, Home, Mail, ShieldCheck, UserCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const tenants = [
  {
    id: 1,
    name: "Brandon Mwangi",
    email: "brandon@example.com",
    lastName: "Mwangi",
    unit: "A101",
    password: "home123",
    house: "Greenview Apartments",
    address: "Kileleshwa, Nairobi",
    leaseStart: "2024-01-01",
    leaseEnd: "2026-12-31",
    rent: 16000,
    waterBill: 1200,
    billingMonth: "2026-07",
    nextPayment: "2026-07-31",
    status: "Active",
    accessCode: "HOUSE-A101",
    maintenance: "No pending issues",
    welcomeMessage: "Your home is ready and your lease is currently active.",
  },
  {
    id: 2,
    name: "Sarah Wanjiku",
    email: "sarah@example.com",
    lastName: "Wanjiku",
    unit: "B201",
    password: "home456",
    house: "Greenview Apartments",
    address: "Kileleshwa, Nairobi",
    leaseStart: "2024-03-01",
    leaseEnd: "2027-02-28",
    rent: 23000,
    waterBill: 1800,
    billingMonth: "2026-07",
    nextPayment: "2026-08-01",
    status: "Active",
    accessCode: "HOUSE-B201",
    maintenance: "Water heater check requested",
    welcomeMessage: "Your tenancy is active and your next payment is due soon.",
  },
]

type Tenant = (typeof tenants)[number]

export default function ClientPortalPage() {
  const [formData, setFormData] = useState({ email: "", unit: "", lastName: "", password: "" })
  const [activeTenant, setActiveTenant] = useState<Tenant | null>(null)
  const [error, setError] = useState("")

  const demoAccessText = useMemo(
    () => "Try: brandon@example.com • A101 • Mwangi • home123",
    [],
  )

  const normalizeValue = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]/g, "")

  const handleDemoLogin = () => {
    setFormData({ email: "brandon@example.com", unit: "A101", lastName: "Mwangi", password: "home123" })
    setError("")
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const email = normalizeValue(formData.email)
    const unit = normalizeValue(formData.unit)
    const lastName = normalizeValue(formData.lastName)
    const password = normalizeValue(formData.password)

    const match = tenants.find((tenant) => {
      const tenantEmail = normalizeValue(tenant.email)
      const tenantUnit = normalizeValue(tenant.unit)
      const tenantLastName = normalizeValue(tenant.lastName)
      const tenantPassword = normalizeValue(tenant.password)

      const emailMatches = tenantEmail === email
      const unitMatches = tenantUnit === unit
      const lastNameMatches = tenantLastName === lastName
      const passwordMatches = tenantPassword === password

      return emailMatches && unitMatches && lastNameMatches && passwordMatches
    })

    if (!match) {
      setError("We could not find a matching home record. Please check your details and try again.")
      setActiveTenant(null)
      return
    }

    setActiveTenant(match)
    setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Building className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RentHub Portal
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <div className="space-y-6">
            <div className="bg-white/90 rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-blue-100 text-blue-700">
                  <Home className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Client Portal</p>
                  <h2 className="text-3xl font-bold text-gray-900">Access your home details</h2>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Use this portal to view your assigned unit, check lease details, review your next payment, and keep track of maintenance requests.
              </p>
            </div>

            <Card className="bg-white/90 shadow-2xl border border-white/20 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Enter your home access details</CardTitle>
                <CardDescription>Use the email, unit number, and last name linked to your tenancy.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unit number</Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
                      placeholder="A101"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Mwangi"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Portal password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  {error ? <p className="text-sm text-red-600">{error}</p> : null}
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Open my home portal
                  </Button>
                </form>
                <div className="flex items-center justify-between gap-3 mt-4">
                  <p className="text-sm text-gray-500">{demoAccessText}</p>
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Use demo details
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {activeTenant ? (
              <>
                <Card className="bg-white/90 shadow-2xl border border-white/20 rounded-3xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">Welcome back, {activeTenant.name}</CardTitle>
                        <CardDescription>{activeTenant.welcomeMessage}</CardDescription>
                      </div>
                      <Badge className="bg-green-600 text-white">{activeTenant.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                      <div className="flex items-center gap-2 text-green-700 font-semibold">
                        <CheckCircle2 className="h-5 w-5" />
                        Access granted to your assigned home
                      </div>
                      <p className="text-sm text-green-700 mt-1">Your unit is ready for you to review and manage.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm text-gray-500">House</p>
                        <p className="font-semibold text-gray-900">{activeTenant.house}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm text-gray-500">Unit</p>
                        <p className="font-semibold text-gray-900">{activeTenant.unit}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-semibold text-gray-900">{activeTenant.address}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm text-gray-500">Access Code</p>
                        <p className="font-semibold text-gray-900">{activeTenant.accessCode}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 shadow-2xl border border-white/20 rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">Your home overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                      <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Lease status</p>
                        <p className="text-sm text-gray-600">From {activeTenant.leaseStart} to {activeTenant.leaseEnd}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                      <Mail className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Next payment</p>
                        <p className="text-sm text-gray-600">Ksh {activeTenant.rent.toLocaleString()} due on {activeTenant.nextPayment}</p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="font-semibold text-gray-900">Billing breakdown</p>
                      <div className="mt-3 space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Rent</span>
                          <span>Ksh {activeTenant.rent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Water bill</span>
                          <span>Ksh {activeTenant.waterBill.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold text-gray-900">
                          <span>Total</span>
                          <span>Ksh {(activeTenant.rent + activeTenant.waterBill).toLocaleString()}</span>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-gray-500">Billing month: {activeTenant.billingMonth}</p>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl border border-purple-100 bg-purple-50 p-4">
                      <UserCircle2 className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Maintenance</p>
                        <p className="text-sm text-gray-600">{activeTenant.maintenance}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-white/90 shadow-2xl border border-white/20 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">What clients can do here</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-gray-600">
                  <p>• View their assigned house and unit</p>
                  <p>• Review lease details and payment deadlines</p>
                  <p>• Track maintenance requests and support updates</p>
                  <p>• Quick access to their home records from one place</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
