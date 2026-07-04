"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Building,
  MapPin,
  Wifi,
  Car,
  Star,
  Shield,
  Phone,
  Mail,
  LocateIcon as LocationIcon,
  X,
  Check,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Generate properties for all 8 floors with 10 units each
const unitTypeMeta: Record<number, { type: string; color: string }> = {
  0: { type: "Bedsitter", color: "bg-blue-500" },
  1: { type: "One-Bedroom", color: "bg-green-500" },
  2: { type: "Two-Bedroom", color: "bg-purple-500" },
  3: { type: "Three-Bedroom", color: "bg-orange-500" },
}


export default function HomePage() {
  const [selectedUnit, setSelectedUnit] = useState<any>(null)
  const [hoveredUnit, setHoveredUnit] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUnits() {
      const { data, error } = await supabase.from("units").select("*").order("floor_number", { ascending: true })

      if (error) {
        console.error("Error fetching units:", error)
        setLoading(false)
        return
      }

      const mapped = data.map((u: any) => {
        const meta = unitTypeMeta[u.bedrooms] ?? unitTypeMeta[0]
        const floorNumber = u.floor_number ?? 1
        return {
          id: u.id,
          title: `Unit ${u.unit_label ?? String(u.id).slice(0, 6)} - ${meta.type}`,
          address: "Greenview Apartments, Kileleshwa, Nairobi",
          price: u.price,
          bedrooms: u.bedrooms,
          bathrooms: u.bathrooms,
          available: u.available,
          image: u.image_url || "/placeholder.svg?height=200&width=300",
          amenities: ["WiFi", "Water", "Security", "Elevator"],
          description: u.description || `${meta.type} unit with modern amenities`,
          rating: 4.8,
          floor:
            floorNumber === 1
              ? "Ground Floor"
              : floorNumber === 8
                ? "8th Floor (Top)"
                : `${floorNumber}${floorNumber === 2 ? "nd" : floorNumber === 3 ? "rd" : "th"} Floor`,
          unit: u.unit_label ?? String(u.id).slice(0, 6),
          floorNumber,
          unitType: meta,
        }
      })

      setProperties(mapped)
      setLoading(false)
    }

    fetchUnits()
  }, [])

  const availableCount = properties.filter((p) => p.available).length
  const occupiedCount = properties.filter((p) => !p.available).length

  const getUnitsByFloor = (floorNumber: number) => {
    return properties.filter((p) => p.floorNumber === floorNumber)
  }

  const handleUnitClick = (unit: any) => {
    setSelectedUnit(unit)
  }

  const handleUnitHover = (unit: any) => {
    setHoveredUnit(unit)
  }

  const handleUnitLeave = () => {
    setHoveredUnit(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <p className="text-gray-500 text-lg">Loading units...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Building className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RentHub
              </h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/portal" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Client Portal
              </Link>
              <Link href="/move-out" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Move-Out Request
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Admin Login
              </Link>
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Contact Us
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight">
              Choose Your Perfect
              <br />
              <span className="text-blue-600">Unit</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Click on any unit in the building below to see details and availability. Find your ideal home in Greenview
              Apartments.
            </p>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
                <div className="text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform">
                  {availableCount}
                </div>
                <div className="text-gray-600 font-medium">Available Units</div>
                <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto mt-3"></div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
                <div className="text-4xl font-bold text-red-500 mb-2 group-hover:scale-110 transition-transform">
                  {occupiedCount}
                </div>
                <div className="text-gray-600 font-medium">Occupied Units</div>
                <div className="w-12 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full mx-auto mt-3"></div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
                <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                  {properties.length}
                </div>
                <div className="text-gray-600 font-medium">Total Units</div>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto mt-3"></div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
                <div className="text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform">
                  8
                </div>
                <div className="text-gray-600 font-medium">Floors</div>
                <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mx-auto mt-3"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-2xl mb-8 border border-white/20">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Unit Types & Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <div>
                <div className="font-semibold text-sm">Bedsitter</div>
                <div className="text-xs text-gray-600">Ksh 9,500/month</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <div>
                <div className="font-semibold text-sm">One-Bedroom</div>
                <div className="text-xs text-gray-600">Ksh 16,000/month</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <div>
                <div className="font-semibold text-sm">Two-Bedroom</div>
                <div className="text-xs text-gray-600">Ksh 23,000/month</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <div>
                <div className="font-semibold text-sm">Three-Bedroom</div>
                <div className="text-xs text-gray-600">Ksh 28,000/month</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-red-600" />
              <span className="text-sm text-gray-600">Occupied</span>
            </div>
          </div>
        </div>

        {/* Building Visualization */}
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl mb-12 border border-white/20">
          <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Greenview Apartments - Interactive Building Map
          </h3>

          <div className="space-y-4">
            {[8, 7, 6, 5, 4, 3, 2, 1].map((floorNumber) => (
              <div key={floorNumber} className="relative">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-20 text-right">
                    <div className="text-sm font-bold text-gray-700">
                      {floorNumber === 1
                        ? "Ground"
                        : floorNumber === 8
                          ? "8th (Top)"
                          : `${floorNumber}${floorNumber === 2 ? "nd" : floorNumber === 3 ? "rd" : "th"}`}
                    </div>
                    <div className="text-xs text-gray-500">Floor</div>
                  </div>
                  <div className="flex-1 grid grid-cols-10 gap-2">
                    {getUnitsByFloor(floorNumber).map((unit) => (
                      <div
                        key={unit.id}
                        className={`
                          relative aspect-square rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-110 hover:z-10 border-2
                          ${
                            unit.available
                              ? `${unit.unitType.color} hover:shadow-lg border-white hover:border-yellow-400`
                              : "bg-gray-400 hover:bg-gray-500 border-gray-300"
                          }
                          ${hoveredUnit?.id === unit.id ? "scale-110 shadow-xl z-10 border-yellow-400" : ""}
                          ${selectedUnit?.id === unit.id ? "ring-4 ring-yellow-400 ring-opacity-50" : ""}
                        `}
                        onClick={() => handleUnitClick(unit)}
                        onMouseEnter={() => handleUnitHover(unit)}
                        onMouseLeave={handleUnitLeave}
                        title={`${unit.unit} - ${unit.available ? "Available" : "Occupied"}`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-white text-xs font-bold text-center">
                            <div>{unit.unit.slice(-3)}</div>
                            {unit.available ? (
                              <Check className="h-3 w-3 mx-auto mt-1" />
                            ) : (
                              <X className="h-3 w-3 mx-auto mt-1" />
                            )}
                          </div>
                        </div>

                        {/* Hover tooltip */}
                        {hoveredUnit?.id === unit.id && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20">
                            <div className="bg-black text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                              <div className="font-bold">{unit.unit}</div>
                              <div>{unit.unitType.type}</div>
                              <div>Ksh {unit.price.toLocaleString()}/month</div>
                              <div className={unit.available ? "text-green-400" : "text-red-400"}>
                                {unit.available ? "Available" : "Occupied"}
                              </div>
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6 text-sm text-gray-600">
            Click on any unit to view details • Hover for quick info • Green = Available • Gray = Occupied
          </div>
        </div>

        {/* Unit Details Modal */}
        <Dialog open={!!selectedUnit} onOpenChange={() => setSelectedUnit(null)}>
          <DialogContent className="max-w-2xl">
            {selectedUnit && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {selectedUnit.title}
                  </DialogTitle>
                  <DialogDescription className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    {selectedUnit.floor} • Unit {selectedUnit.unit}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="relative">
                    <Image
                      src={selectedUnit.image || "/placeholder.svg"}
                      alt={selectedUnit.title}
                      width={600}
                      height={300}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    <Badge
                      className={`absolute top-4 right-4 border-0 shadow-lg ${
                        selectedUnit.available
                          ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
                          : "bg-gradient-to-r from-red-400 to-red-600 text-white"
                      }`}
                    >
                      {selectedUnit.available ? "Available" : "Occupied"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-lg mb-4">Unit Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monthly Rent:</span>
                          <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Ksh {selectedUnit.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bedrooms:</span>
                          <span className="font-semibold">
                            {selectedUnit.bedrooms === 0 ? "Bedsitter" : selectedUnit.bedrooms}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bathrooms:</span>
                          <span className="font-semibold">{selectedUnit.bathrooms}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Floor:</span>
                          <span className="font-semibold">{selectedUnit.floor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rating:</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-semibold">{selectedUnit.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg mb-4">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedUnit.amenities.map((amenity: string) => (
                          <Badge
                            key={amenity}
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                          >
                            {amenity === "WiFi" && <Wifi className="h-3 w-3 mr-1" />}
                            {amenity === "Security" && <Shield className="h-3 w-3 mr-1" />}
                            {amenity === "Parking" && <Car className="h-3 w-3 mr-1" />}
                            {amenity}
                          </Badge>
                        ))}
                      </div>

                      <div className="mt-6">
                        <h4 className="font-bold text-lg mb-2">Description</h4>
                        <p className="text-gray-600 leading-relaxed">{selectedUnit.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t">
                    {selectedUnit.available ? (
                      <Link href={`/book/${selectedUnit.id}`} className="flex-1">
                        <Button className="w-full h-12 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                          Book This Unit
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        className="flex-1 h-12 font-semibold bg-gray-200 text-gray-500 cursor-not-allowed"
                        disabled
                      >
                        Currently Occupied
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => setSelectedUnit(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Building Info Section */}
        <div className="mt-20 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Building Amenities</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enjoy world-class facilities and services in our modern residential building.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 text-center hover:shadow-2xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">24/7 Security</h4>
              <p className="text-gray-600 text-sm">Round-the-clock security with CCTV monitoring</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 text-center hover:shadow-2xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Building className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Modern Elevators</h4>
              <p className="text-gray-600 text-sm">High-speed elevators serving all 8 floors</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 text-center hover:shadow-2xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Car className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Parking Available</h4>
              <p className="text-gray-600 text-sm">Secure parking spaces for residents</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 text-center hover:shadow-2xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Wifi className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">High-Speed WiFi</h4>
              <p className="text-gray-600 text-sm">Complimentary internet in all units</p>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white mt-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <span className="text-3xl font-bold">RentHub</span>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
                Your trusted partner in finding the perfect rental home in Nairobi. We connect you with premium
                properties in the city's best neighborhoods.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Download App
                </Button>
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-6 text-white">Quick Links</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="hover:text-white transition-colors cursor-pointer">Available Rentals</li>
                <li className="hover:text-white transition-colors cursor-pointer">Floor Plans</li>
                <li className="hover:text-white transition-colors cursor-pointer">Building Amenities</li>
                <li className="hover:text-white transition-colors cursor-pointer">Pricing Guide</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-6 text-white">Contact Info</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <a href="tel:+254745549558" className="hover:text-white transition-colors">
                    +254 745 549 558
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <a href="mailto:mwangibrandon2@gmail.com" className="hover:text-white transition-colors">
                    mwangibrandon2@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <LocationIcon className="h-5 w-5 text-blue-400" />
                  <span>Greenview Apartments, Kileleshwa</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 RentHub Kenya. All rights reserved. |
              <span className="text-blue-400 hover:text-blue-300 cursor-pointer">Privacy Policy</span> |
              <span className="text-blue-400 hover:text-blue-300 cursor-pointer">Terms of Service</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
