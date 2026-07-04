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
  Home,
  Calendar,
  User,
  Phone,
  Mail,
  LogOut,
  FileText,
} from "lucide-react"
import Link from "next/link"

// Generate sample move-out requests
const generateMoveOutRequests = () => {
  const requests = []
  const statuses = ["pending", "approved", "rejected", "processing"]

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
  ]

  const reasons = ["job-relocation", "family-reasons", "financial-reasons", "lease-end", "buying-home", "other"]

  const reasonLabels = {
    "job-relocation": "Job Relocation",
    "family-reasons": "Family Reasons",
    "financial-reasons": "Family Reasons",
    "lease-end": "End of Lease Term",
    "buying-home": "Purchasing a Home",
    other: "Other",
  }

  const units = ["A101", "B201", "C301", "D401", "E501", "F601", "G701", "H801"]

  for (let i = 1; i <= 15; i++) {
    const name = sampleNames[Math.floor(Math.random() * sampleNames.length)]
    const firstName = name.split(" ")[0]
    const lastName = name.split(" ")[1]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const reason = reasons[Math.floor(Math.random() * reasons.length)]
    const unit = units[Math.floor(Math.random() * units.length)]
    const submittedDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    const moveOutDate = new Date(submittedDate.getTime() + (30 + Math.floor(Math.random() * 60)) * 24 * 60 * 60 * 1000)

    requests.push({
      id: i,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `+254 7${Math.floor(Math.random() * 100000000)
        .toString()
        .padStart(8, "0")}`,
      currentUnit: unit,
      moveOutDate: moveOutDate.toISOString().split("T")[0],
      reason,
      reasonLabel: reasonLabels[reason as keyof typeof reasonLabels],
      customReason: reason === "other" ? "Moving to a different city for new job opportunity" : "",
      forwardingAddress: "123 New Street, Nairobi",
      forwardingCity: "Nairobi",
      forwardingPostalCode: "00100",
      requestInspection: Math.random() > 0.3,
      depositRefundMethod: ["bank-transfer", "check", "mobile-money"][Math.floor(Math.random() * 3)],
      bankName: "KCB Bank",
      bankAccountNumber: Math.floor(Math.random() * 9000000000) + 1000000000,
      emergencyContact: sampleNames[Math.floor(Math.random() * sampleNames.length)],
      emergencyPhone: `+254 7${Math.floor(Math.random() * 100000000)
        .toString()
        .padStart(8, "0")}`,
      specialRequests: Math.random() > 0.5 ? "Please schedule inspection in the morning" : "",
      status,
      submittedDate: submittedDate.toISOString().split("T")[0],
      reviewedDate:
        status !== "pending"
          ? new Date(submittedDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
          : null,
      adminNotes:
        status !== "pending"
          ? status === "approved"
            ? "Move-out approved. Inspection scheduled."
            : status === "rejected"
              ? "Insufficient notice period provided."
              : "Processing inspection and deposit calculation."
          : "",
      daysNotice: Math.ceil((moveOutDate.getTime() - submittedDate.getTime()) / (1000 * 3600 * 24)),
    })
  }

  return requests.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
}

export default function MoveOutRequestsPage() {
  const [requests, setRequests] = useState(generateMoveOutRequests())
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [adminNotes, setAdminNotes] = useState("")

  const filteredRequests = requests.filter((request) => {
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesSearch =
      searchTerm === "" ||
      request.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.currentUnit.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesSearch
  })

  const statusCounts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    processing: requests.filter((r) => r.status === "processing").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  }

  const handleStatusUpdate = (requestId: number, newStatus: string, notes = "") => {
    setRequests(
      requests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: newStatus,
              reviewedDate: new Date().toISOString().split("T")[0],
              adminNotes: notes || r.adminNotes,
            }
          : r,
      ),
    )

    // Show success message
    const applicant = requests.find((r) => r.id === requestId)
    const statusText = newStatus === "approved" ? "accepted" : newStatus === "rejected" ? "denied" : "updated"

    // You could add a toast notification here
    console.log(`Move-out request for ${applicant?.firstName} ${applicant?.lastName} has been ${statusText}`)

    setSelectedRequest(null)
    setAdminNotes("")
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", text: "Pending", icon: Clock },
      processing: { color: "bg-blue-500", text: "Under Review", icon: Eye },
      approved: { color: "bg-green-500", text: "Accepted", icon: CheckCircle },
      rejected: { color: "bg-red-500", text: "Denied", icon: XCircle },
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

  const getNoticeStatus = (daysNotice: number) => {
    if (daysNotice >= 30) {
      return <Badge className="bg-green-500 text-white">Valid ({daysNotice} days)</Badge>
    } else {
      return <Badge className="bg-red-500 text-white">Invalid ({daysNotice} days)</Badge>
    }
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
              <Link href="/admin/submissions" className="text-gray-600 hover:text-gray-900">
                Applications
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
            Move-Out Requests
          </h2>
          <p className="text-gray-600">Review and manage tenant move-out requests and notices</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Home className="h-4 w-4 text-blue-600" />
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
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{statusCounts.processing}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statusCounts.approved}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Denied</CardTitle>
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
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Under Review</SelectItem>
                  <SelectItem value="approved">Accepted</SelectItem>
                  <SelectItem value="rejected">Denied</SelectItem>
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
                Showing {filteredRequests.length} of {requests.length} requests
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card className="bg-white/90 backdrop-blur-md shadow-2xl border border-white/20 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-white/20">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Move-Out Requests
            </CardTitle>
            <CardDescription className="text-gray-600">
              Review and manage tenant move-out notices and requests
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto max-h-96">
              <Table>
                <TableHeader className="sticky top-0 bg-white/95 backdrop-blur-sm">
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Move-Out Date</TableHead>
                    <TableHead>Notice Period</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-blue-50/50">
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {request.firstName} {request.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{request.email}</div>
                          <div className="text-sm text-gray-500">{request.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{request.currentUnit}</div>
                      </TableCell>
                      <TableCell className="text-sm">{request.moveOutDate}</TableCell>
                      <TableCell>{getNoticeStatus(request.daysNotice)}</TableCell>
                      <TableCell>
                        <div className="text-sm">{request.reasonLabel}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedRequest(request)}
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold">
                                Move-Out Request - {request.firstName} {request.lastName}
                              </DialogTitle>
                              <DialogDescription>
                                Submitted on {request.submittedDate} for Unit {request.currentUnit}
                              </DialogDescription>
                            </DialogHeader>

                            {selectedRequest && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Tenant Information */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2 text-lg">
                                        <User className="h-5 w-5 text-blue-600" />
                                        Tenant Information
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                      <div className="flex justify-between">
                                        <span className="font-medium">Name:</span>
                                        <span>
                                          {selectedRequest.firstName} {selectedRequest.lastName}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">Email:</span>
                                        <span>{selectedRequest.email}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">Phone:</span>
                                        <span>{selectedRequest.phone}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">Current Unit:</span>
                                        <span>{selectedRequest.currentUnit}</span>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Move-Out Details */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2 text-lg">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                        Move-Out Details
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                      <div className="flex justify-between">
                                        <span className="font-medium">Move-Out Date:</span>
                                        <span>{selectedRequest.moveOutDate}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">Notice Period:</span>
                                        {getNoticeStatus(selectedRequest.daysNotice)}
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">Reason:</span>
                                        <span>{selectedRequest.reasonLabel}</span>
                                      </div>
                                      {selectedRequest.customReason && (
                                        <div className="pt-2 border-t">
                                          <span className="font-medium">Details:</span>
                                          <p className="mt-1 text-gray-600">{selectedRequest.customReason}</p>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>

                                  {/* Forwarding Address */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2 text-lg">
                                        <Mail className="h-5 w-5 text-blue-600" />
                                        Forwarding Address
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                      <div className="flex justify-between">
                                        <span className="font-medium">Address:</span>
                                        <span>{selectedRequest.forwardingAddress}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">City:</span>
                                        <span>{selectedRequest.forwardingCity}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">Postal Code:</span>
                                        <span>{selectedRequest.forwardingPostalCode}</span>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Deposit & Inspection */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2 text-lg">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                        Deposit & Inspection
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                      <div className="flex justify-between">
                                        <span className="font-medium">Inspection Requested:</span>
                                        <span>{selectedRequest.requestInspection ? "Yes" : "No"}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">Refund Method:</span>
                                        <span className="capitalize">
                                          {selectedRequest.depositRefundMethod.replace("-", " ")}
                                        </span>
                                      </div>
                                      {selectedRequest.depositRefundMethod === "bank-transfer" && (
                                        <>
                                          <div className="flex justify-between">
                                            <span className="font-medium">Bank:</span>
                                            <span>{selectedRequest.bankName}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="font-medium">Account:</span>
                                            <span>{selectedRequest.bankAccountNumber}</span>
                                          </div>
                                        </>
                                      )}
                                    </CardContent>
                                  </Card>
                                </div>

                                {/* Emergency Contact */}
                                {selectedRequest.emergencyContact && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2 text-lg">
                                        <Phone className="h-5 w-5 text-blue-600" />
                                        Emergency Contact
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-4 text-sm">
                                      <div className="flex justify-between">
                                        <span className="font-medium">Name:</span>
                                        <span>{selectedRequest.emergencyContact}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">Phone:</span>
                                        <span>{selectedRequest.emergencyPhone}</span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}

                                {/* Special Requests */}
                                {selectedRequest.specialRequests && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle>Special Requests</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="text-gray-600">{selectedRequest.specialRequests}</p>
                                    </CardContent>
                                  </Card>
                                )}

                                {/* Admin Actions */}
                                <div className="flex gap-3 pt-4 border-t">
                                  {selectedRequest.status === "pending" || selectedRequest.status === "processing" ? (
                                    <>
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button className="bg-green-600 hover:bg-green-700 text-white">
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Accept Move-Out Request
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle className="text-green-700 flex items-center gap-2">
                                              <CheckCircle className="h-5 w-5" />
                                              Accept Move-Out Request
                                            </DialogTitle>
                                            <DialogDescription>
                                              Are you sure you want to accept the move-out request for{" "}
                                              <strong>
                                                {selectedRequest.firstName} {selectedRequest.lastName}
                                              </strong>{" "}
                                              from Unit <strong>{selectedRequest.currentUnit}</strong>?
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="space-y-4">
                                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                              <h4 className="font-semibold text-green-800 mb-2">This will:</h4>
                                              <ul className="text-sm text-green-700 space-y-1">
                                                <li>• Accept the move-out request officially</li>
                                                <li>• Schedule move-out inspection if requested</li>
                                                <li>• Begin security deposit refund process</li>
                                                <li>
                                                  • Mark unit as available from move-out date:{" "}
                                                  <strong>{selectedRequest.moveOutDate}</strong>
                                                </li>
                                                <li>• Send acceptance notification to tenant</li>
                                                <li>• Generate move-out checklist and instructions</li>
                                              </ul>
                                            </div>
                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                              <h4 className="font-semibold text-blue-800 mb-2">Move-Out Details:</h4>
                                              <div className="text-sm text-blue-700 space-y-1">
                                                <p>
                                                  <strong>Move-Out Date:</strong> {selectedRequest.moveOutDate}
                                                </p>
                                                <p>
                                                  <strong>Notice Period:</strong> {selectedRequest.daysNotice} days
                                                </p>
                                                <p>
                                                  <strong>Reason:</strong> {selectedRequest.reasonLabel}
                                                </p>
                                                <p>
                                                  <strong>Inspection Requested:</strong>{" "}
                                                  {selectedRequest.requestInspection ? "Yes" : "No"}
                                                </p>
                                                <p>
                                                  <strong>Deposit Refund Method:</strong>{" "}
                                                  {selectedRequest.depositRefundMethod.replace("-", " ")}
                                                </p>
                                              </div>
                                            </div>
                                            <div>
                                              <Label htmlFor="acceptNotes">Acceptance Notes & Instructions</Label>
                                              <Textarea
                                                id="acceptNotes"
                                                value={adminNotes}
                                                onChange={(e) => setAdminNotes(e.target.value)}
                                                placeholder="Add notes about inspection scheduling, move-out procedures, deposit processing timeline, or special instructions..."
                                                rows={4}
                                              />
                                            </div>
                                          </div>
                                          <DialogFooter>
                                            <Button variant="outline" onClick={() => setAdminNotes("")}>
                                              Cancel
                                            </Button>
                                            <Button
                                              onClick={() =>
                                                handleStatusUpdate(
                                                  selectedRequest.id,
                                                  "approved",
                                                  adminNotes ||
                                                    `Move-out request accepted. Move-out date: ${selectedRequest.moveOutDate}. ${
                                                      selectedRequest.requestInspection
                                                        ? "Inspection will be scheduled 48 hours before move-out."
                                                        : "No inspection requested."
                                                    } Deposit refund will be processed within 14 business days via ${selectedRequest.depositRefundMethod.replace("-", " ")}.`,
                                                )
                                              }
                                              className="bg-green-600 hover:bg-green-700"
                                            >
                                              <CheckCircle className="h-4 w-4 mr-2" />
                                              Accept Move-Out Request
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
                                            Deny Move-Out Request
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle className="text-red-700 flex items-center gap-2">
                                              <XCircle className="h-5 w-5" />
                                              Deny Move-Out Request
                                            </DialogTitle>
                                            <DialogDescription>
                                              Please provide a clear reason for denying the move-out request from{" "}
                                              <strong>
                                                {selectedRequest.firstName} {selectedRequest.lastName}
                                              </strong>
                                              . This information will be shared with the tenant.
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="space-y-4">
                                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                              <h4 className="font-semibold text-red-800 mb-2">This will:</h4>
                                              <ul className="text-sm text-red-700 space-y-1">
                                                <li>• Deny the move-out request officially</li>
                                                <li>• Send denial notification to tenant with reason</li>
                                                <li>• Keep the unit marked as occupied</li>
                                                <li>• Require tenant to continue lease obligations</li>
                                                <li>• Close this move-out request permanently</li>
                                              </ul>
                                            </div>
                                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                              <h4 className="font-semibold text-yellow-800 mb-2">
                                                Common Denial Reasons:
                                              </h4>
                                              <ul className="text-sm text-yellow-700 space-y-1">
                                                <li>• Insufficient notice period (less than 30 days)</li>
                                                <li>• Outstanding rent or utility payments</li>
                                                <li>• Lease agreement violations</li>
                                                <li>• Property damage requiring repair</li>
                                                <li>• Missing required documentation</li>
                                              </ul>
                                            </div>
                                            <div>
                                              <Label htmlFor="denyReason">Denial Reason *</Label>
                                              <Select
                                                value={
                                                  adminNotes.includes("Insufficient notice")
                                                    ? "insufficient-notice"
                                                    : adminNotes.includes("Outstanding payments")
                                                      ? "outstanding-payments"
                                                      : adminNotes.includes("Lease violations")
                                                        ? "lease-violations"
                                                        : adminNotes.includes("Property damage")
                                                          ? "property-damage"
                                                          : adminNotes.includes("Missing documentation")
                                                            ? "missing-docs"
                                                            : "custom"
                                                }
                                                onValueChange={(value) => {
                                                  const reasons = {
                                                    "insufficient-notice": `Insufficient notice period provided. Your move-out request shows only ${selectedRequest.daysNotice} days notice, but your lease requires a minimum of 30 days written notice. Please submit a new request with the proper notice period.`,
                                                    "outstanding-payments":
                                                      "Outstanding rent or utility payments must be settled before move-out can be approved. Please contact the office to review your account balance and arrange payment.",
                                                    "lease-violations":
                                                      "There are unresolved lease agreement violations that must be addressed before move-out approval. Please contact management to discuss resolution.",
                                                    "property-damage":
                                                      "Property inspection reveals damage beyond normal wear and tear that requires repair or additional charges. Please schedule a meeting to discuss repair requirements.",
                                                    "missing-docs":
                                                      "Required move-out documentation is incomplete. Please submit all required forms and documentation before resubmitting your request.",
                                                    custom: "",
                                                  }
                                                  setAdminNotes(reasons[value as keyof typeof reasons])
                                                }}
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Select denial reason" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="insufficient-notice">
                                                    Insufficient Notice Period
                                                  </SelectItem>
                                                  <SelectItem value="outstanding-payments">
                                                    Outstanding Payments
                                                  </SelectItem>
                                                  <SelectItem value="lease-violations">
                                                    Lease Agreement Violations
                                                  </SelectItem>
                                                  <SelectItem value="property-damage">
                                                    Property Damage Issues
                                                  </SelectItem>
                                                  <SelectItem value="missing-docs">Missing Documentation</SelectItem>
                                                  <SelectItem value="custom">Custom Reason</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Textarea
                                                id="denyReason"
                                                value={adminNotes}
                                                onChange={(e) => setAdminNotes(e.target.value)}
                                                placeholder="Please provide a detailed explanation for the denial. Be specific about what the tenant needs to do to resolve the issue..."
                                                rows={4}
                                                required
                                                className="mt-2"
                                              />
                                            </div>
                                          </div>
                                          <DialogFooter>
                                            <Button variant="outline" onClick={() => setAdminNotes("")}>
                                              Cancel
                                            </Button>
                                            <Button
                                              onClick={() =>
                                                handleStatusUpdate(selectedRequest.id, "rejected", adminNotes)
                                              }
                                              className="bg-red-600 hover:bg-red-700"
                                            >
                                              <XCircle className="h-4 w-4 mr-2" />
                                              Deny Move-Out Request
                                            </Button>
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>

                                      <Button
                                        variant="outline"
                                        onClick={() =>
                                          handleStatusUpdate(
                                            selectedRequest.id,
                                            "processing",
                                            "Move-out request under review - verifying tenant information, checking account status, and reviewing lease terms.",
                                          )
                                        }
                                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                      >
                                        <Eye className="h-4 w-4 mr-2" />
                                        Mark Under Review
                                      </Button>
                                    </>
                                  ) : (
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg w-full">
                                      <div className="flex items-center gap-2">
                                        {selectedRequest.status === "approved" ? (
                                          <CheckCircle className="h-5 w-5 text-green-600" />
                                        ) : (
                                          <XCircle className="h-5 w-5 text-red-600" />
                                        )}
                                        <span className="font-medium">
                                          Request {selectedRequest.status === "approved" ? "Accepted" : "Denied"}
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        Reviewed on {selectedRequest.reviewedDate}
                                      </div>
                                      {selectedRequest.status === "approved" && (
                                        <div className="ml-auto">
                                          <Badge className="bg-green-100 text-green-800">
                                            Move-out: {selectedRequest.moveOutDate}
                                          </Badge>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Admin Notes */}
                                {selectedRequest.adminNotes && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle>Admin Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="text-gray-600">{selectedRequest.adminNotes}</p>
                                    </CardContent>
                                  </Card>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
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
