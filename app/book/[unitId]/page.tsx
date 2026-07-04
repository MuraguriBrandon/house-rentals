"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Building,
  MapPin,
  Star,
  ArrowLeft,
  User,
  Calendar,
  FileText,
  CheckCircle,
  Home,
  Users,
  CreditCard,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Generate the same properties as in the main page
const generateProperties = () => {
  const properties = []
  const unitTypes = [
    { type: "Bedsitter", bedrooms: 0, bathrooms: 1, price: 9500, color: "bg-blue-500" },
    { type: "One-Bedroom", bedrooms: 1, bathrooms: 1, price: 16000, color: "bg-green-500" },
    { type: "Two-Bedroom", bedrooms: 2, bathrooms: 2, price: 23000, color: "bg-purple-500" },
    { type: "Three-Bedroom", bedrooms: 3, bathrooms: 2, price: 28000, color: "bg-orange-500" },
  ]

  let id = 1
  for (let floor = 1; floor <= 8; floor++) {
    for (let unit = 1; unit <= 10; unit++) {
      let unitTypeIndex
      if (floor <= 2) {
        unitTypeIndex = 0
      } else if (floor <= 4) {
        unitTypeIndex = 1
      } else if (floor <= 6) {
        unitTypeIndex = 2
      } else {
        unitTypeIndex = 3
      }

      const unitType = unitTypes[unitTypeIndex]
      const unitLetter = String.fromCharCode(64 + unit)
      const unitNumber = `${unitLetter}${floor}${unit.toString().padStart(2, "0")}`
      const isAvailable = Math.random() > 0.4
      const rating = (4.5 + Math.random() * 0.5).toFixed(1)

      properties.push({
        id: id++,
        title: `Unit ${unitNumber} - ${unitType.type}`,
        address: "Greenview Apartments, Kileleshwa, Nairobi",
        price: unitType.price,
        bedrooms: unitType.bedrooms,
        bathrooms: unitType.bathrooms,
        available: isAvailable,
        image: "/placeholder.svg?height=300&width=400",
        amenities: [
          "WiFi",
          "Water",
          "Security",
          "Elevator",
          ...(floor > 4 ? ["Balcony"] : []),
          ...(floor > 6 ? ["City Views"] : []),
        ],
        description: `${floor === 1 ? "Ground" : floor === 8 ? "Top" : `${floor}${floor === 2 ? "nd" : floor === 3 ? "rd" : "th"}`} floor ${unitType.type.toLowerCase()} with modern amenities`,
        rating: Number.parseFloat(rating),
        floor:
          floor === 1
            ? "Ground Floor"
            : floor === 8
              ? `8th Floor (Top)`
              : `${floor}${floor === 2 ? "nd" : floor === 3 ? "rd" : "th"} Floor`,
        unit: unitNumber,
        floorNumber: floor,
        unitNumber: unit,
        unitType: unitType,
      })
    }
  }

  return properties
}

const properties = generateProperties()

export default function BookUnitPage() {
  const params = useParams()
  const router = useRouter()
  const unitId = params.unitId as string
  const [unit, setUnit] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  // Form data
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationalId: "",

    // Rental Information
    moveInDate: "",
    leaseDuration: "",
    numberOfOccupants: "",
    hasPets: false,
    petDetails: "",

    // Emergency Contact
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelationship: "",

    // Additional Information
    additionalRequests: "",
    agreeToTerms: false,
    agreeToBackgroundCheck: false,
  })

  useEffect(() => {
    const foundUnit = properties.find((p) => p.id.toString() === unitId)
    if (foundUnit && foundUnit.available) {
      setUnit(foundUnit)
    } else {
      router.push("/")
    }
  }, [unitId, router])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)
    }, 2000)
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const calculateTotalCosts = () => {
    if (!unit) return { deposit: 0, rent: 0, total: 0 }

    const rent = unit.price
    const deposit = rent * 2 // 2 months deposit
    const total = rent + deposit

    return { deposit, rent, total }
  }

  if (!unit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unit Not Found</h2>
          <p className="text-gray-600 mb-4">The unit you're looking for is not available or doesn't exist.</p>
          <Link href="/">
            <Button>Back to Properties</Button>
          </Link>
        </div>
      </div>
    )
  }

  const costs = calculateTotalCosts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Properties</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Building className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RentHub
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Unit Information Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/90 backdrop-blur-md shadow-2xl border border-white/20 rounded-2xl sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {unit.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  {unit.floor} • Unit {unit.unit}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <Image
                    src={unit.image || "/placeholder.svg"}
                    alt={unit.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <Badge className="absolute top-3 right-3 bg-gradient-to-r from-green-400 to-green-600 text-white border-0">
                    Available
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monthly Rent:</span>
                    <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Ksh {unit.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-blue-500" />
                      <span>{unit.bedrooms === 0 ? "Bedsitter" : `${unit.bedrooms} BR`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>{unit.bathrooms} Bath</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{unit.rating}</span>
                    <span className="text-gray-500 text-sm">(4.5+ rating)</span>
                  </div>
                </div>

                <Separator />

                {/* Cost Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-bold text-lg">Cost Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monthly Rent:</span>
                      <span>Ksh {costs.rent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Security Deposit (2 months):</span>
                      <span>Ksh {costs.deposit.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Initial Payment:</span>
                      <span className="text-blue-600">Ksh {costs.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl">
                  <h5 className="font-semibold text-blue-900 mb-2">What's Included:</h5>
                  <div className="flex flex-wrap gap-2">
                    {unit.amenities.map((amenity: string) => (
                      <Badge key={amenity} variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-md shadow-2xl border border-white/20 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Rental Application</CardTitle>
                <CardDescription>
                  Complete this application to book {unit.title}. All fields are required for processing.
                </CardDescription>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mt-6">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          currentStep >= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={`w-24 h-1 mx-2 ${currentStep > step ? "bg-blue-600" : "bg-gray-200"}`} />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>Personal Info</span>
                  <span>Rental Details</span>
                  <span>Review</span>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <User className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-bold">Personal Information</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            placeholder="Enter your first name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            placeholder="Enter your last name"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="+254 700 000 000"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="nationalId">National ID Number *</Label>
                          <Input
                            id="nationalId"
                            value={formData.nationalId}
                            onChange={(e) => handleInputChange("nationalId", e.target.value)}
                            placeholder="12345678"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Emergency Contact</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="emergencyName">Full Name *</Label>
                            <Input
                              id="emergencyName"
                              value={formData.emergencyName}
                              onChange={(e) => handleInputChange("emergencyName", e.target.value)}
                              placeholder="Emergency contact name"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="emergencyPhone">Phone Number *</Label>
                            <Input
                              id="emergencyPhone"
                              value={formData.emergencyPhone}
                              onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                              placeholder="+254 700 000 000"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="emergencyRelationship">Relationship *</Label>
                            <Select
                              value={formData.emergencyRelationship}
                              onValueChange={(value) => handleInputChange("emergencyRelationship", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="parent">Parent</SelectItem>
                                <SelectItem value="sibling">Sibling</SelectItem>
                                <SelectItem value="spouse">Spouse</SelectItem>
                                <SelectItem value="friend">Friend</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Rental Details (previously Step 3) */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-bold">Rental Details</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="moveInDate">Preferred Move-in Date *</Label>
                          <Input
                            id="moveInDate"
                            type="date"
                            value={formData.moveInDate}
                            onChange={(e) => handleInputChange("moveInDate", e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="leaseDuration">Lease Duration *</Label>
                          <Select
                            value={formData.leaseDuration}
                            onValueChange={(value) => handleInputChange("leaseDuration", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select lease duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="6-months">6 months</SelectItem>
                              <SelectItem value="1-year">1 year</SelectItem>
                              <SelectItem value="2-years">2 years</SelectItem>
                              <SelectItem value="3-years">3 years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="numberOfOccupants">Number of Occupants *</Label>
                        <Select
                          value={formData.numberOfOccupants}
                          onValueChange={(value) => handleInputChange("numberOfOccupants", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="How many people will live in the unit?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 person</SelectItem>
                            <SelectItem value="2">2 people</SelectItem>
                            <SelectItem value="3">3 people</SelectItem>
                            <SelectItem value="4">4 people</SelectItem>
                            <SelectItem value="5+">5+ people</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="hasPets"
                            checked={formData.hasPets}
                            onCheckedChange={(checked) => handleInputChange("hasPets", checked)}
                          />
                          <Label htmlFor="hasPets">I have pets</Label>
                        </div>

                        {formData.hasPets && (
                          <div>
                            <Label htmlFor="petDetails">Pet Details *</Label>
                            <Textarea
                              id="petDetails"
                              value={formData.petDetails}
                              onChange={(e) => handleInputChange("petDetails", e.target.value)}
                              placeholder="Please describe your pets (type, breed, size, age, etc.)"
                              rows={3}
                              required
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="additionalRequests">Additional Requests or Comments</Label>
                        <Textarea
                          id="additionalRequests"
                          value={formData.additionalRequests}
                          onChange={(e) => handleInputChange("additionalRequests", e.target.value)}
                          placeholder="Any special requests or additional information you'd like to share"
                          rows={4}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Review and Submit (previously Step 4) */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-bold">Review Your Application</h3>
                      </div>

                      <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                            <p>
                              <strong>Name:</strong> {formData.firstName} {formData.lastName}
                            </p>
                            <p>
                              <strong>Email:</strong> {formData.email}
                            </p>
                            <p>
                              <strong>Phone:</strong> {formData.phone}
                            </p>
                            <p>
                              <strong>National ID:</strong> {formData.nationalId}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Rental Details</h4>
                            <p>
                              <strong>Move-in Date:</strong> {formData.moveInDate}
                            </p>
                            <p>
                              <strong>Lease Duration:</strong> {formData.leaseDuration}
                            </p>
                            <p>
                              <strong>Occupants:</strong> {formData.numberOfOccupants}
                            </p>
                            <p>
                              <strong>Pets:</strong> {formData.hasPets ? "Yes" : "No"}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Emergency Contact</h4>
                            <p>
                              <strong>Name:</strong> {formData.emergencyName}
                            </p>
                            <p>
                              <strong>Phone:</strong> {formData.emergencyPhone}
                            </p>
                            <p>
                              <strong>Relationship:</strong> {formData.emergencyRelationship}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                            required
                          />
                          <Label htmlFor="agreeToTerms" className="text-sm">
                            I agree to the{" "}
                            <span className="text-blue-600 underline cursor-pointer">Terms and Conditions</span> and{" "}
                            <span className="text-blue-600 underline cursor-pointer">Rental Agreement</span> *
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="agreeToBackgroundCheck"
                            checked={formData.agreeToBackgroundCheck}
                            onCheckedChange={(checked) => handleInputChange("agreeToBackgroundCheck", checked)}
                            required
                          />
                          <Label htmlFor="agreeToBackgroundCheck" className="text-sm">
                            I consent to background and credit checks as part of the application process *
                          </Label>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Your application will be reviewed within 24-48 hours</li>
                          <li>• We may contact you for additional documentation</li>
                          <li>• Background and credit checks will be conducted</li>
                          <li>• You'll receive an email confirmation once approved</li>
                          <li>• Payment instructions will be provided upon approval</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t">
                    <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                      Previous
                    </Button>

                    {currentStep < 3 ? (
                      <Button type="button" onClick={nextStep}>
                        Next Step
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting || !formData.agreeToTerms || !formData.agreeToBackgroundCheck}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting Application...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Submit Application
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-center text-2xl font-bold text-gray-900">Application Submitted!</DialogTitle>
            <DialogDescription className="text-center space-y-3">
              <p>
                Thank you for your rental application for <strong>{unit.title}</strong>.
              </p>
              <p>We've received your application and will review it within 24-48 hours.</p>
              <p>You'll receive an email confirmation shortly with your application reference number.</p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowSuccess(false)} className="flex-1">
              Submit Another
            </Button>
            <Link href="/" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">Back to Properties</Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
