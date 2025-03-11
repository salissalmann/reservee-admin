'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LayoutGrid, Trash2 } from "lucide-react"
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { AddMultipleTickets } from '@/app/_apis/tickets-apis'
import { TicketType } from '@/app/_types/event-types'
import { RemoveSeatmapFromEvent } from '@/app/_apis/event-apis'


export default function SeatMapConfig({
  id,
  orgId,
  tickets,
  setStepper,
  venue_config,
  getEvent
}: {
  id: string,
  orgId: string,
  tickets: TicketType[],
  setStepper: (stepper: number) => void,
  venue_config: string,
  getEvent: () => void
}) {
  const router = useRouter()
  const [form, setForm] = useState<TicketType[]>([])

  useEffect(() => {
    if (tickets && tickets.length > 0) {
      setForm(tickets)
    } else {
      setForm([
        { name: "", price: 0, description: "", quantity: 0 }
      ])
    }
  }, [tickets])

  const addTicketType = () => {
    setForm([...form, { name: "", price: 0, description: "", quantity: 0 }])
  }

  const removeTicketType = (index: number) => {
    const newForm = form.filter((_, i) => i !== index)
    setForm(newForm)
  }

  const handleSubmit = async () => {
    try {
      const response = await AddMultipleTickets({
        tickets: form,
        event_id: id,
        org_id: orgId
      })
      if (response.statusCode === 200) {
        toast.success("Tickets added successfully");
        getEvent();
        // setStepper(4);
      } else {
        toast.error("Failed to add tickets. Please try again.");
      }
    } catch (error) {
      console.error("Error adding tickets:", error);
      toast.error("Failed to add tickets. Please try again.");
    }
  }

  const removeSeatmap = async () => {
    try {
      const response = await RemoveSeatmapFromEvent(id);
      if (response.statusCode === 200) {
        toast.success("Seatmap removed successfully");
        getEvent();
        setForm([{ name: "", price: 0, description: "", quantity: 0 }])
      } else {
        toast.error("Failed to remove seatmap. Please try again.");
      }
    } catch (error) {
      console.error("Error removing seatmap:", error);
    }
  }


  return (
    <div className="px-4 p y-8 w-full mb-20">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold mb-2">Step 4. Seat Map & Pricing</h1>
        <p className="text-gray-500">
          Customize Your Seating Map, Set Ticket Prices, And Configure Accessibility Options.
        </p>
      </div>

      <div className="grid md:grid-cols-[45%_10%_45%] gap-8">
        <div className={`border dark:border-borderDark border-gray-200 border-dashed rounded-lg p-8 flex items-center justify-center dark:bg-tertiary bg-gray-50 min-h-[400px]
          ${tickets.length > 0 ? "blur-sm pointer-events-none opacity-50" : ""}`}>
          <div className="flex flex-col gap-4">
            <Button className="gap-2 dark:bg-tertiary dark:text-white dark:border-borderDark" variant="outline" size="lg"
              onClick={() => {
                window.open(`/seatmap/${id}`, '_blank');
              }}
            >
              <LayoutGrid className="h-5 w-5" />
              Open Seat Map Editor
            </Button>
            {venue_config !== "" && (
              <Button
                onClick={removeSeatmap}
                variant="outline"
                className="z-50 dark:bg-tertiary text-primary dark:border-borderDark flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Remove Seatmap
              </Button>
            )}
          </div>
        </div>

        {/* OR */}

        <div className='flex  md:flex-col gap-4 items-center justify-center'>
          <div className="space-y-4 border dark:border-borderDark border-gray-500 rounded-lg border-dashed w-full md:w-0 md:h-full"></div>
          <div className="text-sm text-gray-500">OR</div>
          <div className="space-y-4 border dark:border-borderDark border-gray-500 rounded-lg border-dashed w-full md:w-0 md:h-full"></div>
        </div>

        <div className={`space-y-4 border dark:border-borderDark border-gray-200 rounded-lg p-4 border-dashed relative
              ${venue_config !== "" ? "blur-sm pointer-events-none opacity-50" : ""}`}>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Ticket Types</h3>
            <div className="flex items-center gap-2">
              {tickets.length > 0 && (
                <Button
                  onClick={removeSeatmap}
                  variant="outline"
                  className="dark:bg-tertiary dark:text-white dark:border-borderDark flex items-center gap-2"
                  disabled={form.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove Ticket Types
                </Button>
              )}
              <Button
                onClick={addTicketType}
                variant="outline"
                className="dark:bg-tertiary dark:text-white dark:border-borderDark"
              >
                Add Ticket Type
              </Button>
            </div>
          </div>

          {form.map((ticket, index) => (
            <div key={index} className="space-y-3 p-4 border dark:border-borderDark border-gray-200 rounded-lg">
              <div className="flex flex-col md:flex-row justify-between items-start">
                <h4 className="text-sm font-medium">Ticket Type {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTicketType(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className="grid gap-2">
                  <Label htmlFor={`name-${index}`}>Category</Label>
                  <Input
                    id={`name-${index}`}
                    placeholder="e.g., Platinum"
                    value={ticket.name}
                    className='dark:bg-tertiary dark:text-white dark:border-borderDark'
                    onChange={(e) => {
                      const newForm = [...form];
                      newForm[index].name = e.target.value;
                      setForm(newForm);
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor={`price-${index}`}>Price</Label>
                  <Input
                    id={`price-${index}`}
                    type="number"
                    min="0"
                    placeholder="e.g., 20.00"
                    value={ticket.price}
                    className='dark:bg-tertiary dark:text-white dark:border-borderDark'
                    onChange={(e) => {
                      const newForm = form.map((item, i) => {
                        if (i === index) {
                          return { ...item, price: parseFloat(e.target.value) };
                        }
                        return item;
                      });
                      setForm(newForm);
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                  <Input
                    id={`quantity-${index}`}
                    type="number"
                    min="0"
                    placeholder="e.g., 100"
                    value={ticket.quantity}
                    className='dark:bg-tertiary dark:text-white dark:border-borderDark'
                    onChange={(e) => {
                      const newForm = form.map((item, i) => {
                        if (i === index) {
                          return { ...item, quantity: parseInt(e.target.value) };
                        }
                        return item;
                      });
                      setForm(newForm);
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor={`description-${index}`}>Description</Label>
                  <Input
                    id={`description-${index}`}
                    value={ticket.description}
                    placeholder="e.g., VIP access, early entry, etc."
                    className='dark:bg-tertiary dark:text-white dark:border-borderDark'
                    onChange={(e) => {
                      const newForm = [...form];
                      newForm[index].description = e.target.value;
                      setForm(newForm);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            onClick={handleSubmit}
            className="w-full rounded-full bg-primary text-white hover:bg-primary/90 font-bold cursor-pointer hover:scale-105 transition-all duration-300"
            disabled={form.length === 0}
          >
            Submit & Next
          </Button>
        </div>
      </div>
    </div>
  )
}

