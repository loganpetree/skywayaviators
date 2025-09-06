"use client"

import * as React from "react"
import { TrendingUp, Calendar, User, Mail } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface RequestData {
  id: string;
  date: string;
  name: string;
  email: string;
  type: string;
  status: "pending" | "approved" | "rejected";
}

const requestData: RequestData[] = [
  { id: "1", date: "2024-06-30", name: "John Smith", email: "john@example.com", type: "Flight Training", status: "pending" },
  { id: "2", date: "2024-06-29", name: "Sarah Johnson", email: "sarah@example.com", type: "Check Ride", status: "approved" },
  { id: "3", date: "2024-06-28", name: "Mike Davis", email: "mike@example.com", type: "Discovery Flight", status: "pending" },
  { id: "4", date: "2024-06-27", name: "Lisa Wilson", email: "lisa@example.com", type: "Flight Training", status: "rejected" },
  { id: "5", date: "2024-06-26", name: "Tom Brown", email: "tom@example.com", type: "Check Ride", status: "approved" },
  { id: "6", date: "2024-06-25", name: "Emma Davis", email: "emma@example.com", type: "Discovery Flight", status: "pending" },
  { id: "7", date: "2024-06-24", name: "Chris Miller", email: "chris@example.com", type: "Flight Training", status: "pending" },
  { id: "8", date: "2024-06-23", name: "Anna Taylor", email: "anna@example.com", type: "Check Ride", status: "approved" },
  { id: "9", date: "2024-06-22", name: "David Lee", email: "david@example.com", type: "Discovery Flight", status: "rejected" },
  { id: "10", date: "2024-06-21", name: "Rachel Green", email: "rachel@example.com", type: "Flight Training", status: "pending" },
]

export function RequestsTable() {
  const [selectedDateRange, setSelectedDateRange] = React.useState("30d")
  const [selectedStatus, setSelectedStatus] = React.useState("all")

  // Filter data based on selected date range and status
  const getFilteredData = () => {
    const now = new Date()
    const ranges = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '6m': 180,
      '1y': 365
    }

    const daysToShow = ranges[selectedDateRange as keyof typeof ranges] || 30
    const cutoffDate = new Date(now.getTime() - (daysToShow * 24 * 60 * 60 * 1000))

    let filtered = requestData.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= cutoffDate
    })

    if (selectedStatus !== "all") {
      filtered = filtered.filter(item => item.status === selectedStatus)
    }

    return filtered.slice(0, 20) // Limit to 20 items for performance
  }

  const filteredData = getFilteredData()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col items-stretch sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 py-2">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Flight Requests</span>
          </h3>
          <div className="text-sm text-muted-foreground">
            Manage and review flight training requests
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {/* Date Range Filter */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {["7d", "30d", "90d", "6m", "1y"].map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedDateRange(range)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    selectedDateRange === range
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Status:</span>
              {["all", "pending", "approved", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    selectedStatus === status
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="flex gap-6 mt-4 sm:mt-0 sm:items-end">
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-xl leading-none font-bold">
              {filteredData.length}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground">Pending</span>
            <span className="text-xl leading-none font-bold text-yellow-600">
              {filteredData.filter(item => item.status === "pending").length}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground">Approved</span>
            <span className="text-xl leading-none font-bold text-green-600">
              {filteredData.filter(item => item.status === "approved").length}
            </span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="border rounded-lg overflow-hidden">
        {filteredData.length === 0 ? (
          <div className="h-[300px] w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/50">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23000000' fill-opacity='1'%3e%3cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
              }}></div>
            </div>

            <div className="text-center space-y-6 relative z-10">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
                  No requests found
                </h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed font-medium">
                  No flight requests match the selected filters
                </p>
              </div>

              <div className="flex items-center justify-center space-x-3 pt-2">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse delay-150"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse delay-300"></div>
                </div>
                <span className="text-xs text-slate-400 font-medium tracking-wide">
                  NO REQUESTS FOR PERIOD
                </span>
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse delay-450"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse delay-600"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse delay-750"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {new Date(request.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </TableCell>
                  <TableCell className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{request.name}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {request.email}
                  </TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {request.status === "pending" && (
                        <>
                          <Button size="sm" variant="outline" className="h-8">
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 text-red-600 hover:text-red-700">
                            Reject
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost" className="h-8">
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
