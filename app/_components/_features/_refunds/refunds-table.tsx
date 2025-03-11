"use client"
import React from "react"
import { useState } from "react"
import { Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RefundDetails } from "./refund-details"
import { RefundRequest } from "@/app/_types/refunds-types"
import { GetCurrencyIcon } from "@/app/_components/_layout-components/currency-icons"

export function RefundTable({ refundRequests , getRefundRequests }: { refundRequests: RefundRequest[], getRefundRequests: () => void }) {
  const [expandedRow, setExpandedRow] = useState<string | null>("R102345")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // Pagination calculations
  const totalPages = Math.ceil((refundRequests?.length || 0) / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRequests = refundRequests?.slice(startIndex, endIndex) || []

  // Handle null values and format date safely
  const formatDate = (date: string | null) => {
    if (!date) return "N/A"
    try {
      return new Date(date).toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      })
    } catch (error) {
      return "Invalid Date"
    }
  }

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    setExpandedRow(null) // Close expanded row when changing pages
  }

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request ID</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Ticket Type</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!refundRequests || refundRequests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                No refund requests found
              </TableCell>
            </TableRow>
          ) : (
            currentRequests.map((row: RefundRequest) => (
              <React.Fragment key={row.refund_id}>
                <TableRow>
                  <TableCell className="font-medium">{row.refund_id || "N/A"}</TableCell>
                  <TableCell>{formatDate(row.created_at)}</TableCell>
                  <TableCell>{row.created_by || "N/A"}</TableCell>
                  <TableCell>
                    {row.order_type 
                      ? row.order_type.charAt(0).toUpperCase() + row.order_type.slice(1)
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {row.refund_amount || "0"}
                      <div className="-mt-0.5">
                        {GetCurrencyIcon(row.currency || "EUR", 3.5)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{(row.reason || "No reason provided").length > 50 ? (row.reason || "No reason provided").slice(0, 50) + "..." : (row.reason || "No reason provided")}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        row.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : row.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : row.status === "Declined"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 flex items-center gap-2"
                      onClick={() => setExpandedRow(expandedRow === row.refund_id ? null : row.refund_id)}
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedRow === row.refund_id && (
                  <TableRow>
                    <TableCell colSpan={9} className="p-0">
                      <RefundDetails request={row} getRefundRequests={getRefundRequests} />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {refundRequests && refundRequests.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(endIndex, refundRequests.length)} of {refundRequests.length} results
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

