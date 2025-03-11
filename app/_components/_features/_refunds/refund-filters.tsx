"use client"
import React, { useState } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RefundRequest } from "@/app/_types/refunds-types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function RefundFilters({ setRefundRequests, retrievedRefundRequests }: { setRefundRequests: (refundRequests: RefundRequest[]) => void, retrievedRefundRequests: RefundRequest[] }) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date | undefined }>({
    from: new Date(),
    to: undefined,
  })
  const statusOptions = ["All", "Pending", "Approved", "Rejected"]
  const ticketTypes = ["All", ...Array.from(new Set(retrievedRefundRequests.map(req => req.order_type)))]

  const handleStatusFilter = (status: string) => {
    const filtered = status === "All"
      ? retrievedRefundRequests
      : retrievedRefundRequests.filter(req => req.status.toLowerCase() === status.toLowerCase())
    setRefundRequests(filtered)
  }

  const handleDateFilter = (range: { from: Date; to: Date | undefined }) => {
    setDateRange(range)
    if (!range.to) return

    const filtered = retrievedRefundRequests.filter(req => {
      const requestDate = new Date(req.created_at)
      return requestDate >= range.from && requestDate <= range.to!
    })
    setRefundRequests(filtered)
  }

  const handleTicketTypeFilter = (type: string) => {
    const filtered = type === "All"
      ? retrievedRefundRequests
      : retrievedRefundRequests.filter(req => req.order_type === type)
    setRefundRequests(filtered)
  }

  return (
    <div className="flex gap-2">
      <Select onValueChange={handleStatusFilter}>
        <SelectTrigger className="bg-white">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Refund Status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map(status => (
            <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="bg-white">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              "Date Range"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from ?? new Date()}
            selected={dateRange}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                handleDateFilter({ from: range.from, to: range.to })
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <Select onValueChange={handleTicketTypeFilter}>
        <SelectTrigger className="bg-white">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Ticket Type" />
        </SelectTrigger>
        <SelectContent>
          {ticketTypes.map(type => (
            <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

