"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Building,
  ArrowLeft,
  Home,
  Calendar,
  FileText,
  CheckCircle,
  AlertTriangle,
  Phone,
  Mail,
  User,
} from "lucide-react"
import Link from "next/link"

export default function MoveOutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    // Tenant Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentUnit: "",

    // Move-out Details
    moveOutDate: "",
    reason: "",
    customReason: "",
    forwardingAddress: "",
    forwardingCity: "",
    forwardingPostalCode: "",

    // Inspection & Deposit
    requestInspection: true,
    depositRefundMethod: "",
    bankAccountNumber: "",
    bankName: "",

    // Additional Information
    emergencyContact: "",
    emergencyPhone: "",
    specialRequests: "",

    // Agreements
    agreeToTerms: false,
    confirmNotice: false,
  })

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

  const calculateNoticeDate = () => {
    if (formData.moveOutDate) {
      const moveOutDate = new Date(formData.moveOutDate)
      const noticeDate = new Date(moveOutDate)
      noticeDate.setDate(noticeDate.getDate() - 30) // 30 days notice
      return noticeDate.toISOString().split("T")[0]
    }
    return ""
  }

  const isValidNotice = () => {
    if (!formData.moveOutDate) return false
    const today = new Date()
    const moveOutDate = new Date(formData.moveOutDate)
    const daysDifference = Math.ceil((moveOutDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
    return daysDifference >= 30
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
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
                RentHub
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
              <Home className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            Move-Out Request
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Submit your move-out notice and request. Please provide at least 30 days notice as required by your lease
            agreement.
          </p>
        </div>

        {/* Notice Period Warning */}
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-orange-600 mt-1" />
              <div>
                <h3 className="font-bold text-orange-800 mb-2">Important Notice Requirements</h3>
                <ul className="text-orange-700 space-y-1 text-sm">
                  <li>• You must provide at least 30 days written notice before moving out</li>
                  <li>• Move-out inspections are scheduled within 48 hours of your move-out date</li>
                  <li>• Security deposit refunds are processed within 14 business days</li>
                  <li>• All rent must be paid through your move-out date</li>
                  <li>• Unit must be returned in original condition (normal wear excepted)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Move-Out Form */}
        <Card className="bg-white/90 backdrop-blur-md shadow-2xl border border-white/20 rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-white/20">
            <CardTitle className="text-2xl font-bold text-gray-900">Move-Out Request Form</CardTitle>
            <CardDescription>
              Complete this form to officially notify us of your intent to move out. All fields marked with * are
              required.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Tenant Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-bold">Tenant Information</h3>
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

                <div>
                  <Label htmlFor="currentUnit">Current Unit *</Label>
                  <Select
                    value={formData.currentUnit}
                    onValueChange={(value) => handleInputChange("currentUnit", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your current unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A101">Unit A101 - Ground Floor</SelectItem>
                      <SelectItem value="A201">Unit A201 - 2nd Floor</SelectItem>
                      <SelectItem value="B301">Unit B301 - 3rd Floor</SelectItem>
                      <SelectItem value="C401">Unit C401 - 4th Floor</SelectItem>
                      <SelectItem value="D501">Unit D501 - 5th Floor</SelectItem>
                      <SelectItem value="E601">Unit E601 - 6th Floor</SelectItem>
                      <SelectItem value="F701">Unit F701 - 7th Floor</SelectItem>
                      <SelectItem value="G801">Unit G801 - 8th Floor (Top)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Move-Out Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-bold">Move-Out Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="moveOutDate">Intended Move-Out Date *</Label>
                    <Input
                      id="moveOutDate"
                      type="date"
                      value={formData.moveOutDate}
                      onChange={(e) => handleInputChange("moveOutDate", e.target.value)}
                      min={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                      required
                    />
                    {formData.moveOutDate && !isValidNotice() && (
                      <p className="text-red-600 text-sm mt-1">⚠️ Must provide at least 30 days notice</p>
                    )}
                    {formData.moveOutDate && isValidNotice() && (
                      <p className="text-green-600 text-sm mt-1">✓ Valid notice period (30+ days)</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="reason">Reason for Moving *</Label>
                    <Select value={formData.reason} onValueChange={(value) => handleInputChange("reason", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="job-relocation">Job Relocation</SelectItem>
                        <SelectItem value="family-reasons">Family Reasons</SelectItem>
                        <SelectItem value="financial-reasons">Financial Reasons</SelectItem>
                        <SelectItem value="property-issues">Property Issues</SelectItem>
                        <SelectItem value="lease-end">End of Lease Term</SelectItem>
                        <SelectItem value="buying-home">Purchasing a Home</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.reason === "other" && (
                  <div>
                    <Label htmlFor="customReason">Please specify your reason *</Label>
                    <Textarea
                      id="customReason"
                      value={formData.customReason}
                      onChange={(e) => handleInputChange("customReason", e.target.value)}
                      placeholder="Please provide details about your reason for moving out"
                      rows={3}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Forwarding Address */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-bold">Forwarding Address</h3>
                </div>

                <div>
                  <Label htmlFor="forwardingAddress">New Address *</Label>
                  <Input
                    id="forwardingAddress"
                    value={formData.forwardingAddress}
                    onChange={(e) => handleInputChange("forwardingAddress", e.target.value)}
                    placeholder="Enter your new address"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="forwardingCity">City *</Label>
                    <Input
                      id="forwardingCity"
                      value={formData.forwardingCity}
                      onChange={(e) => handleInputChange("forwardingCity", e.target.value)}
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="forwardingPostalCode">Postal Code</Label>
                    <Input
                      id="forwardingPostalCode"
                      value={formData.forwardingPostalCode}
                      onChange={(e) => handleInputChange("forwardingPostalCode", e.target.value)}
                      placeholder="Postal code"
                    />
                  </div>
                </div>
              </div>

              {/* Deposit & Inspection */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-bold">Inspection & Security Deposit</h3>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requestInspection"
                    checked={formData.requestInspection}
                    onCheckedChange={(checked) => handleInputChange("requestInspection", checked)}
                  />
                  <Label htmlFor="requestInspection">
                    Request move-out inspection (recommended for deposit refund)
                  </Label>
                </div>

                <div>
                  <Label htmlFor="depositRefundMethod">Preferred Deposit Refund Method *</Label>
                  <Select
                    value={formData.depositRefundMethod}
                    onValueChange={(value) => handleInputChange("depositRefundMethod", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select refund method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      <SelectItem value="check">Check by Mail</SelectItem>
                      <SelectItem value="mobile-money">Mobile Money (M-Pesa)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.depositRefundMethod === "bank-transfer" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bankName">Bank Name *</Label>
                      <Input
                        id="bankName"
                        value={formData.bankName}
                        onChange={(e) => handleInputChange("bankName", e.target.value)}
                        placeholder="Enter bank name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="bankAccountNumber">Account Number *</Label>
                      <Input
                        id="bankAccountNumber"
                        value={formData.bankAccountNumber}
                        onChange={(e) => handleInputChange("bankAccountNumber", e.target.value)}
                        placeholder="Enter account number"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Emergency Contact */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-bold">Emergency Contact</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                      placeholder="Contact person name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                      placeholder="+254 700 000 000"
                    />
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <Label htmlFor="specialRequests">Special Requests or Comments</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                  placeholder="Any special requests for the move-out process, inspection scheduling, or other concerns..."
                  rows={4}
                />
              </div>

              {/* Agreements */}
              <div className="space-y-4 p-6 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-gray-900">Required Confirmations</h4>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="confirmNotice"
                    checked={formData.confirmNotice}
                    onCheckedChange={(checked) => handleInputChange("confirmNotice", checked)}
                    required
                  />
                  <Label htmlFor="confirmNotice" className="text-sm leading-relaxed">
                    I confirm that I am providing the required 30-day written notice as specified in my lease agreement
                    *
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                    required
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                    I agree to comply with all move-out procedures, return the unit in good condition, and understand
                    that my security deposit refund is subject to inspection results *
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.agreeToTerms || !formData.confirmNotice || !isValidNotice()}
                  className="w-full md:w-auto px-12 py-3 text-lg font-semibold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting Move-Out Request...
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5 mr-2" />
                      Submit Move-Out Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-center text-2xl font-bold text-gray-900">
              Move-Out Request Submitted!
            </DialogTitle>
            <DialogDescription className="text-center space-y-3">
              <p>
                Thank you for submitting your move-out request for <strong>Unit {formData.currentUnit}</strong>.
              </p>
              <p>
                We've received your 30-day notice for move-out on <strong>{formData.moveOutDate}</strong>.
              </p>
              <p>You'll receive an email confirmation shortly with your request reference number and next steps.</p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowSuccess(false)} className="flex-1">
              Submit Another
            </Button>
            <Link href="/" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">Back to Home</Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
