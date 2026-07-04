"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
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
  Building,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  FileText,
  User,
  Phone,
  Home,
  LogOut,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"

// Generate sample submissions data
const generateSubmissions = () => {
  const submissions = []
  const statuses = ["pending", "approved", "rejected", "under-review"]
  const statusColors = {
    pending: "bg-yellow-500",
    approved: "bg-green-500",
    rejected: "bg-red-500",
    "under-review": "bg-blue-500",
  }

  const sampleNames = [
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

  const unitTypes = ["Bedsitter", "One-Bedroom", "Two-Bedroom", "Three-Bedroom"]
  const leaseDurations = ["6-months", "1-year", "2-years", "3-years"]

  for (let i = 1; i <= 25; i++) {
    const name = sampleNames[Math.floor(Math.random() * sampleNames.length)]
    const firstName = name.split(" ")[0]
    const lastName = name.split(" ")[1]
    const unitType = unitTypes[Math.floor(Math.random() * unitTypes.length)]
    const floor = Math.floor(Math.random() * 8) + 1
    const unitNumber = `${String.fromCharCode(65 + Math.floor(Math.random() * 10))}${floor}${Math.floor(
      Math.random() * 10 + 1,
    )
      .toString()
      .padStart(2, "0")}`
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const submittedDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    const moveInDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)

    submissions.push({
      id: i,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `+254 7${Math.floor(Math.random() * 100000000)
        .toString()
        .padStart(8, "0")}`,
      dateOfBirth: new Date(
        1990 + Math.floor(Math.random() * 25),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1,
      )
        .toISOString()
        .split("T")[0],
      nationalId: Math.floor(Math.random() * 90000000) + 10000000,
      unitTitle: `Unit ${unitNumber} - ${unitType}`,
      unitNumber,
      floor: floor === 1 ? "Ground Floor" : `${floor}${floor === 2 ? "nd" : floor === 3 ? "rd" : "th"} Floor`,
      moveInDate: moveInDate.toISOString().split("T")[0],
      leaseDuration: leaseDurations[Math.floor(Math.random() * leaseDurations.length)],
      numberOfOccupants: Math.floor(Math.random() * 4) + 1,
      hasPets: Math.random() > 0.7,
      petDetails: Math.random() > 0.7 ? "1 small dog, well-trained" : "",
      emergencyName: sampleNames[Math.floor(Math.random() * sampleNames.length)],
      emergencyPhone: `+254 7${Math.floor(Math.random() * 100000000)
        .toString()
        .padStart(8, "0")}`,
      emergencyRelationship: ["parent", "sibling", "spouse", "friend"][Math.floor(Math.random() * 4)],
      additionalRequests: Math.random() > 0.5 ? "Ground floor preferred due to mobility issues" : "",
      status,
      submittedDate: submittedDate.toISOString().split("T")[0],
      reviewedDate:
        status !== "pending"
          ? new Date(submittedDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
          : null,
      reviewNotes:
        status !== "pending"
          ? status === "approved"
            ? "Application approved. All documents verified."
            : status === "rejected"
              ? "Incomplete documentation provided."
              : "Waiting for additional documents."
          : "",
    })
  }

  return submissions.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
}

const handleStatusUpdate = (
  submissionId: number,
  newStatus: string,
  notes = "",
  submissions: any[],
  setSubmissions: any,
  setSelectedSubmission: any,
  setReviewNotes: any,
) => {
  setSubmissions(
    submissions.map((s) =>
      s.id === submissionId
        ? {
            ...s,
            status: newStatus,
            reviewedDate: new Date().toISOString().split("T")[0],
            reviewNotes: notes || s.reviewNotes,
          }
        : s,
    ),
  )

  // Show success message
  const applicant = submissions.find((s) => s.id === submissionId)
  const statusText = newStatus === "approved" ? "approved" : newStatus === "rejected" ? "rejected" : "updated"

  // You could add a toast notification here
  console.log(`Application for ${applicant?.firstName} ${applicant?.lastName} has been ${statusText}`)

  setSelectedSubmission(null)
  setReviewNotes("")
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState(generateSubmissions())
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [reviewNotes, setReviewNotes] = useState("")

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter
    const matchesSearch =
      searchTerm === "" ||
      submission.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.unitNumber.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesSearch
  })

  const statusCounts = {
    all: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    "under-review": submissions.filter((s) => s.status === "under-review").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", text: "Pending", icon: Clock },
      "under-review": { color: "bg-blue-500", text: "Under Review", icon: Eye },
      approved: { color: "bg-green-500", text: "Approved", icon: CheckCircle },
      rejected: { color: "bg-red-500", text: "Rejected", icon: XCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon

    return (
      <Badge className={`${config.color} text-white border-0 flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    )
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
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                View Site
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Rental Applications
          </h2>
          <p className="text-gray-600">Review and manage all rental application submissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{statusCounts.all}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{statusCounts["under-review"]}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statusCounts.approved}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/80 backdrop-blur-md shadow-xl mb-8 border border-white/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <Label>Filters:</Label>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2 flex-1">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by name, email, or unit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div className="text-sm text-gray-600">
                Showing {filteredSubmissions.length} of {submissions.length} applications
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="bg-white/90 backdrop-blur-md shadow-2xl border border-white/20 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-white/20">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Application Submissions
            </CardTitle>
            <CardDescription className="text-gray-600">
              Review and manage rental applications from prospective tenants
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto max-h-96">
              <Table>
                <TableHeader className="sticky top-0 bg-white/95 backdrop-blur-sm">
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Move-in Date</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id} className="hover:bg-blue-50/50">
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {submission.firstName} {submission.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{submission.email}</div>
                          <div className="text-sm text-gray-500">{submission.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{submission.unitNumber}</div>
                          <div className="text-sm text-gray-500">{submission.floor}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{submission.moveInDate}</TableCell>
                      <TableCell className="text-sm">{submission.submittedDate}</TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedSubmission(submission)}
                                className="border-blue-200 text-blue-600 hover:bg-blue-50"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">
                                  Application Details - {submission.firstName} {submission.lastName}
                                </DialogTitle>
                                <DialogDescription>
                                  Submitted on {submission.submittedDate} for {submission.unitTitle}
                                </DialogDescription>
                              </DialogHeader>

                              {selectedSubmission && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Personal Information */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                          <User className="h-5 w-5 text-blue-600" />
                                          Personal Information
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                          <span className="font-medium">Full Name:</span>
                                          <span>
                                            {selectedSubmission.firstName} {selectedSubmission.lastName}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">Email:</span>
                                          <span>{selectedSubmission.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">Phone:</span>
                                          <span>{selectedSubmission.phone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">Date of Birth:</span>
                                          <span>{selectedSubmission.dateOfBirth}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">National ID:</span>
                                          <span>{selectedSubmission.nationalId}</span>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Rental Details */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                          <Home className="h-5 w-5 text-blue-600" />
                                          Rental Details
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                          <span className="font-medium">Unit:</span>
                                          <span>{selectedSubmission.unitTitle}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">Floor:</span>
                                          <span>{selectedSubmission.floor}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">Move-in Date:</span>
                                          <span>{selectedSubmission.moveInDate}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">Lease Duration:</span>
                                          <span>{selectedSubmission.leaseDuration}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">Occupants:</span>
                                          <span>{selectedSubmission.numberOfOccupants}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">Pets:</span>
                                          <span>{selectedSubmission.hasPets ? "Yes" : "No"}</span>
                                        </div>
                                        {selectedSubmission.petDetails && (
                                          <div className="pt-2 border-t">
                                            <span className="font-medium">Pet Details:</span>
                                            <p className="mt-1 text-gray-600">{selectedSubmission.petDetails}</p>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>

                                    {/* Emergency Contact */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                          <Phone className="h-5 w-5 text-blue-600" />
                                          Emergency Contact
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                          <span className="font-medium">Name:</span>
                                          <span>{selectedSubmission.emergencyName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">Phone:</span>
                                          <span>{selectedSubmission.emergencyPhone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">Relationship:</span>
                                          <span className="capitalize">{selectedSubmission.emergencyRelationship}</span>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Application Status */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                          <FileText className="h-5 w-5 text-blue-600" />
                                          Application Status
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium">Current Status:</span>
                                          {getStatusBadge(selectedSubmission.status)}
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">Submitted:</span>
                                          <span>{selectedSubmission.submittedDate}</span>
                                        </div>
                                        {selectedSubmission.reviewedDate && (
                                          <div className="flex justify-between">
                                            <span className="font-medium">Reviewed:</span>
                                            <span>{selectedSubmission.reviewedDate}</span>
                                          </div>
                                        )}
                                        {selectedSubmission.reviewNotes && (
                                          <div className="pt-2 border-t">
                                            <span className="font-medium">Review Notes:</span>
                                            <p className="mt-1 text-gray-600">{selectedSubmission.reviewNotes}</p>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </div>

                                  {selectedSubmission.additionalRequests && (
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                          <MessageSquare className="h-5 w-5 text-blue-600" />
                                          Additional Requests
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <p className="text-gray-600">{selectedSubmission.additionalRequests}</p>
                                      </CardContent>
                                    </Card>
                                  )}

                                  {/* Action Buttons */}
                                  <div className="flex gap-3 pt-4 border-t">
                                    {selectedSubmission.status === "pending" ||
                                    selectedSubmission.status === "under-review" ? (
                                      <>
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button className="bg-green-600 hover:bg-green-700 text-white">
                                              <CheckCircle className="h-4 w-4 mr-2" />
                                              Approve Application
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle className="text-green-700">Approve Application</DialogTitle>
                                              <DialogDescription>
                                                Are you sure you want to approve the rental application for{" "}
                                                <strong>
                                                  {selectedSubmission.firstName} {selectedSubmission.lastName}
                                                </strong>{" "}
                                                for <strong>{selectedSubmission.unitTitle}</strong>?
                                              </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                <h4 className="font-semibold text-green-800 mb-2">This will:</h4>
                                                <ul className="text-sm text-green-700 space-y-1">
                                                  <li>• Mark the application as approved</li>
                                                  <li>• Send approval notification to applicant</li>
                                                  <li>• Reserve the unit for this tenant</li>
                                                  <li>• Generate lease agreement documents</li>
                                                </ul>
                                              </div>
                                              <div>
                                                <Label htmlFor="approveNotes">Approval Notes (Optional)</Label>
                                                <Textarea
                                                  id="approveNotes"
                                                  value={reviewNotes}
                                                  onChange={(e) => setReviewNotes(e.target.value)}
                                                  placeholder="Add any notes about the approval, next steps, or special conditions..."
                                                  rows={3}
                                                />
                                              </div>
                                            </div>
                                            <DialogFooter>
                                              <Button variant="outline" onClick={() => setReviewNotes("")}>
                                                Cancel
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleStatusUpdate(
                                                    selectedSubmission.id,
                                                    "approved",
                                                    reviewNotes ||
                                                      "Application approved - tenant can proceed with lease signing and payment.",
                                                    submissions,
                                                    setSubmissions,
                                                    setSelectedSubmission,
                                                    setReviewNotes,
                                                  )
                                                }
                                                className="bg-green-600 hover:bg-green-700"
                                              >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Approve Application
                                              </Button>
                                            </DialogFooter>
                                          </DialogContent>
                                        </Dialog>

                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button
                                              variant="outline"
                                              className="border-red-200 text-red-600 hover:bg-red-50"
                                            >
                                              <XCircle className="h-4 w-4 mr-2" />
                                              Reject Application
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle className="text-red-700">Reject Application</DialogTitle>
                                              <DialogDescription>
                                                Please provide a clear reason for rejecting the application from{" "}
                                                <strong>
                                                  {selectedSubmission.firstName} {selectedSubmission.lastName}
                                                </strong>
                                                . This information will be shared with the applicant.
                                              </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                                <h4 className="font-semibold text-red-800 mb-2">This will:</h4>
                                                <ul className="text-sm text-red-700 space-y-1">
                                                  <li>• Mark the application as rejected</li>
                                                  <li>• Send rejection notification to applicant</li>
                                                  <li>• Free up the unit for other applicants</li>
                                                  <li>• Close this application permanently</li>
                                                </ul>
                                              </div>
                                              <div>
                                                <Label htmlFor="rejectNotes">Rejection Reason *</Label>
                                                <Select
                                                  value={
                                                    reviewNotes.includes("Incomplete documentation")
                                                      ? "incomplete"
                                                      : reviewNotes.includes("Credit check")
                                                        ? "credit"
                                                        : reviewNotes.includes("Income requirements")
                                                          ? "income"
                                                          : reviewNotes.includes("References")
                                                            ? "references"
                                                            : "custom"
                                                  }
                                                  onValueChange={(value) => {
                                                    const reasons = {
                                                      incomplete:
                                                        "Incomplete documentation provided. Please submit all required documents and reapply.",
                                                      credit:
                                                        "Credit check did not meet our requirements. Please improve your credit score and reapply in 6 months.",
                                                      income:
                                                        "Income requirements not met. Monthly income must be at least 3x the rent amount.",
                                                      references:
                                                        "Unable to verify employment or personal references. Please provide valid references.",
                                                      custom: "",
                                                    }
                                                    setReviewNotes(reasons[value as keyof typeof reasons])
                                                  }}
                                                >
                                                  <SelectTrigger>
                                                    <SelectValue placeholder="Select rejection reason" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="incomplete">Incomplete Documentation</SelectItem>
                                                    <SelectItem value="credit">Credit Check Failed</SelectItem>
                                                    <SelectItem value="income">Income Requirements Not Met</SelectItem>
                                                    <SelectItem value="references">Invalid References</SelectItem>
                                                    <SelectItem value="custom">Custom Reason</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                                <Textarea
                                                  id="rejectNotes"
                                                  value={reviewNotes}
                                                  onChange={(e) => setReviewNotes(e.target.value)}
                                                  placeholder="Please provide a detailed explanation for the rejection..."
                                                  rows={4}
                                                  required
                                                  className="mt-2"
                                                />
                                              </div>
                                            </div>
                                            <DialogFooter>
                                              <Button variant="outline" onClick={() => setReviewNotes("")}>
                                                Cancel
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleStatusUpdate(
                                                    selectedSubmission.id,
                                                    "rejected",
                                                    reviewNotes,
                                                    submissions,
                                                    setSubmissions,
                                                    setSelectedSubmission,
                                                    setReviewNotes,
                                                  )
                                                }
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                                disabled={!reviewNotes.trim()}
                                              >
                                                <XCircle className="h-4 w-4 mr-2" />
                                                Reject Application
                                              </Button>
                                            </DialogFooter>
                                          </DialogContent>
                                        </Dialog>

                                        <Button
                                          variant="outline"
                                          onClick={() =>
                                            handleStatusUpdate(
                                              selectedSubmission.id,
                                              "under-review",
                                              "Application moved to under review - additional verification in progress.",
                                              submissions,
                                              setSubmissions,
                                              setSelectedSubmission,
                                              setReviewNotes,
                                            )
                                          }
                                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                        >
                                          <Eye className="h-4 w-4 mr-2" />
                                          Mark Under Review
                                        </Button>
                                      </>
                                    ) : (
                                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                          {selectedSubmission.status === "approved" ? (
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                          ) : (
                                            <XCircle className="h-5 w-5 text-red-600" />
                                          )}
                                          <span className="font-medium">
                                            Application{" "}
                                            {selectedSubmission.status === "approved" ? "Approved" : "Rejected"}
                                          </span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          Reviewed on {selectedSubmission.reviewedDate}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
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
