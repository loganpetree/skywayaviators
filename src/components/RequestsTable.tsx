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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Request } from "@/types/request"

interface RequestsTableProps {
  requests: Request[];
  onUpdateStatus: (requestId: string, isResponded: boolean) => void;
}

export function RequestsTable({ requests, onUpdateStatus }: RequestsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'responded':
        return "bg-green-100 text-green-800"
      case 'cancelled':
        return "bg-red-100 text-red-800"
      case 'pending':
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getInterestTypeLabel = (interestType: string) => {
    switch (interestType) {
      case 'course':
        return 'Flight Course'
      case 'rental':
        return 'Aircraft Rental'
      case 'timeBuilding':
        return 'Time Building'
      default:
        return interestType
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
            Today's flight requests - mark as responded when contacted
          </div>
        </div>

        {/* Summary Stats */}
        <div className="flex gap-6 mt-4 sm:mt-0 sm:items-end">
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-xl leading-none font-bold">
              {requests.length}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground">Pending</span>
            <span className="text-xl leading-none font-bold text-yellow-600">
              {requests.filter(item => item.status === 'pending').length}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground">Responded</span>
            <span className="text-xl leading-none font-bold text-green-600">
              {requests.filter(item => item.status === 'responded').length}
            </span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="border rounded-lg overflow-hidden">
        {requests.length === 0 ? (
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
                  No requests today
                </h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed font-medium">
                  No flight requests have been received today
                </p>
              </div>

              <div className="flex items-center justify-center space-x-3 pt-2">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse delay-150"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse delay-300"></div>
                </div>
                <span className="text-xs text-slate-400 font-medium tracking-wide">
                  NO REQUESTS TODAY
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
                <TableHead className="w-[120px]">Time</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead className="text-center">Response Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.dateSubmitted ? new Date(request.dateSubmitted).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true
                    }) : 'N/A'}
                  </TableCell>
                  <TableCell className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{`${request.firstName || ''} ${request.lastName || ''}`.trim() || 'N/A'}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {request.email || 'N/A'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {request.phone || 'N/A'}
                  </TableCell>
                  <TableCell>{request.interestType ? getInterestTypeLabel(request.interestType) : 'N/A'}</TableCell>
                  <TableCell className="text-center">
                    {request.id && (
                      <RadioGroup
                        value={request.status === 'responded' ? 'responded' : 'pending'}
                        onValueChange={(value) => {
                          const isResponded = value === 'responded';
                          onUpdateStatus(request.id, isResponded);
                        }}
                        className="flex justify-center space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pending" id={`pending-${request.id}`} />
                          <Label htmlFor={`pending-${request.id}`} className="text-sm cursor-pointer">
                            Pending
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="responded" id={`responded-${request.id}`} />
                          <Label htmlFor={`responded-${request.id}`} className="text-sm cursor-pointer">
                            Responded
                          </Label>
                        </div>
                      </RadioGroup>
                    )}
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
