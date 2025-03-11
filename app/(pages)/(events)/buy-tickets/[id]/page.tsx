'use client'
import React, { useState } from 'react'
import { useEvent } from '../../../../_hooks/_events/get-event-by-id';
import { IEvent } from '@/app/_types/event-types';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { CalendarDays, Circle, Clock2, Hourglass, MapPin, Tag, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import DrawingCanvas from '@/app/(pages)/(reservation-seat)/seatmap/main-canvas';
import { SeatSelections } from '@/app/(pages)/(reservation-seat)/seatmap/types';

interface Ticket {
    name: string
    description: string
    quantity: number
    price: number
}

interface TicketSelection {
    [key: string]: number
}

export const runtime = 'edge';

export default function Page({ params }: { params: { id: string } }) {
    const { id } = params

    const { event, isLoading, error } = useEvent(id);

    const [seatSelections, setSeatSelections] = useState<SeatSelections[]>([])

    if (error) return <div className="h-screen flex justify-center items-center">Error: {error}</div>;
    if (isLoading) return <div>Loading...</div>

    // console.log(event);

    return (
        <div className="min-h-screen flex flex-col">
             

            <div className="w-full md:w-[80%] mx-auto px-4 md:py-6 py-2 flex-grow mb-32">
                <div className='bg-tertiary p-4 rounded-md flex md:flex-row flex-col justify-between md:items-center backdrop-blur-sm'>
                    <div className='flex md:flex-row flex-col gap-4 justify-center items-start'>
                        <div className='flex flex-col gap-2'>
                            <img src={getEventImages(event!).coverImages[0]?.preview || '/no-image.png'} alt={event?.event_title} width={100} height={100} className='hidden md:block' />
                        </div>
                        <div className='flex flex-col gap-1 justify-start items-start'>
                            <h1 className='text-2xl md:text-4xl font-bold text-white'>{event?.event_title}</h1>
                            <p className='text-xl md:text-md text-gray-300'>Hosted by {event?.organization_name}</p>
                            <div className='text-sm text-white'>
                                <Link href={`/events/${event?.id}`}>
                                    Back to event details
                                </Link>
                            </div>
                        </div>
                    </div>
                    <Carousel className="relative flex flex-col gap-2">
                        <CarouselContent>
                            {event?.date_times?.map((date: any, index: number) => (
                                <CarouselItem key={index}>
                                    <div className="grid grid-cols-1 t md:grid-cols-2 gap-2 border-2 border-primary rounded-md p-4 mt-4 md:mt-0">
                                        <div className='flex flex-row gap-2'>
                                            <span className='text-white font-bold flex items-center gap-2'><CalendarDays className="h-4 w-4" /> Date:</span>
                                            <span className='text-white text-sm md:text-base'>{transformDate(date.date)}</span>
                                        </div>
                                        <div className='flex flex-row gap-2'>
                                            <span className='text-white font-bold flex items-center gap-2'><MapPin className="h-4 w-4" /> Location:</span>
                                            <span className='text-white text-sm md:text-base'>{event?.venue_name && event?.venue_name?.length > 20 ? event?.venue_name?.substring(0, 20) + '...' : event?.venue_name}</span>
                                        </div>
                                        <div className='flex flex-row gap-2'>
                                            <span className='text-white font-bold flex items-center gap-2'><Clock2 className="h-4 w-4" /> Start Time:</span>
                                            <span className='text-white text-sm md:text-base'>{date.stime}</span>
                                        </div>
                                        <div className='flex flex-row gap-2'>
                                            <span className='text-white font-bold flex items-center gap-2'><Clock2 className="h-4 w-4" /> End Time:</span>
                                            <span className='text-white text-sm md:text-base'>{date.etime}</span>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="flex justify-center items-center">
                            {event?.date_times && event.date_times.length > 1 && (
                                <>
                                    <CarouselPrevious className="-left-4 border-2 border-primary rounded-full bg-white/10 backdrop-blur-md text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed w-8 h-8" />
                                    <CarouselNext className="-right-4 border-2 border-primary rounded-full bg-white/10 backdrop-blur-md text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed w-8 h-8" />
                                </>
                            )}
                        </div>
                    </Carousel>
                </div>
                {event?.ticket_types && event?.ticket_types.length > 0 ? (
                    <CustomTicketView {...event} />
                ) : event?.venue_config ? (
                    <div className="w-full py-6">
                        <div className="flex flex-col md:grid gap-6 md:grid-cols-[1fr_400px]">
                            <div className="space-y-6 rounded-md p-4 w-full bg-[#F6F6F6] border border-gray-200 h-fit">
                                <div className="flex flex-row justify-center items-center gap-8 md:gap-2 border-b-2 md:border border-gray-100 rounded-md p-2 w-full md:w-[30%]">
                                    <div className="flex flex-row justify-center items-center gap-2">
                                        <Circle className="w-4 h-4 text-[rgba(239, 64, 74, 0.2)]" color="rgba(239, 64, 74, 0.2)" fill="rgba(239, 64, 74, 0.2)" />
                                        <h1 className="text-tertiary dark:text-white text-sm font-light">Available</h1>
                                    </div>
                                    <div className="flex flex-row justify-center items-center gap-2">
                                        <Circle className="w-4 h-4 text-black" color="black" fill="black" />
                                        <h1 className="text-black dark:text-white text-sm font-light">Occupied</h1>
                                    </div>
                                    <div className="flex flex-row justify-center items-center gap-2">
                                        <Circle className="w-4 h-4 text-[rgba(239, 64, 74, 1)]" color="rgba(239, 64, 74, 1)" fill="rgba(239, 64, 74, 1)" />
                                        <h1 className="text-primary dark:text-white text-sm font-light">Selected</h1>
                                    </div>
                                </div>

                                <DrawingCanvas 
                                    adjustHeight={true} 
                                    calledFromEventPage={true} 
                                    seatSelections={seatSelections} 
                                    setSeatSelections={setSeatSelections}
                                    eventId={id}
                                    venueConfig={event?.venue_config || ""}
                                />
                            </div>
                            <Card className="bg-white border-gray-200 shadow-none h-fit">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-semibold text-black mb-4">Order Summary</h3>
                                    {seatSelections.length > 0 ? (
                                        <div className="space-y-2">
                                            {seatSelections.map((seat: SeatSelections, index: number) => (
                                                <div 
                                                    key={index} 
                                                    className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-b-0"
                                                >
                                                    <div>
                                                        <p className="font-medium text-sm">Area: {seat.areaName}</p>
                                                        <p className="text-xs text-gray-500">Seat: {seat.seatNumber}</p>
                                                        {/* <p className="text-xs text-gray-500">{seat.polygonId}</p> */}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-sm">${seat.price.toFixed(2)}</span>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-6 w-6 text-red-500 hover:bg-red-50"
                                                            onClick={() => {
                                                                setSeatSelections(prev => 
                                                                    prev.filter((_, i) => i !== index)
                                                                )
                                                            }}
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No seats selected</p>
                                    )}
                                    <Separator className="bg-gray-200 my-4" />
                                    <div className="flex flex-row justify-between items-center">
                                        <h4 className="text-lg font-semibold text-black">Total: </h4>
                                        <h4 className="text-xl font-bold">
                                            ${seatSelections.reduce((total, seat) => total + seat.price, 0).toFixed(2)}
                                        </h4>
                                    </div>
                                    <Button 
                                        className="w-full bg-primary text-white font-bold py-4 rounded-full mt-4"
                                        disabled={seatSelections.length === 0}
                                    >
                                        Continue to Payment
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-500">
                        No ticket types or seat map available for this event.
                    </div>
                )}

            </div>


             


        </div>
    )
}

 const getEventImages = (event: IEvent) => {
    const coverImages = event?.images?.files?.filter((image: any) => image.isCover) || [];
    const restImages = event?.images?.files?.filter((image: any) => !image.isCover) || [];
    if (coverImages.length === 0) {
        coverImages.push(restImages[0]);
        restImages.splice(0, 1);
    }
    return { coverImages, restImages };
};

const transformDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};



const CustomTicketView = (event: IEvent) => {
    const [selectedTickets, setSelectedTickets] = useState<TicketSelection>({})

    const handleQuantityChange = (ticketName: string, delta: number) => {
        setSelectedTickets(prev => {
            const currentQty = prev[ticketName] || 0
            const newQty = Math.max(0, currentQty + delta)
            return { ...prev, [ticketName]: newQty }
        })
    }

    const calculateTotal = () => {
        return event?.tickets?.reduce((total: number, ticket: Ticket) => {
            const quantity = selectedTickets[ticket.name] || 0
            return total + (ticket.price * quantity)
        }, 0) || 0
    }

    const handleRemoveTicket = (ticketName: string) => {
        setSelectedTickets(prev => {
            const newState = { ...prev }
            delete newState[ticketName]
            return newState
        })
    }
    return (
        <div className="w-full py-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-black">Select Tickets</h2>
                    <div className="space-y-4">
                        {event?.tickets?.map((ticket: Ticket, index: number) => (
                            <Card key={index} className="bg-white border-gray-200 shadow-none">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-lg text-black">{ticket.name}</h3>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Info className="h-4 w-4 text-gray-400" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="max-w-xs">{ticket.description}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Tag className="h-4 w-4" />
                                                <span className="text-lg font-semibold">
                                                    {event?.currency}
                                                    {ticket.price.toFixed(2)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700">
                                                {ticket.quantity} tickets remaining
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleQuantityChange(ticket.name, -1)}
                                                disabled={!selectedTickets[ticket.name]}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="w-8 text-center text-black">
                                                {selectedTickets[ticket.name] || 0}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleQuantityChange(ticket.name, 1)}
                                                disabled={selectedTickets[ticket.name] >= ticket.quantity}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="lg:sticky lg:top-6 space-y-6 h-fit">
                    <Card className="bg-white border-gray-200 shadow-none">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-semibold text-black mb-4">Order Summary</h3>
                            <div className="space-y-4">
                                {Object.entries(selectedTickets).map(([name, quantity]) => {
                                    if (quantity === 0) return null
                                    const ticket = event?.tickets?.find((t: Ticket) => t.name === name)
                                    if (!ticket) return null
                                    return (
                                        <div key={name} className="flex justify-between text-sm border border-gray-200 rounded-md p-2">
                                            <span className="text-gray-700">
                                                {quantity}x {name}
                                            </span>
                                            <span className="text-gray-700 font-medium flex items-center gap-2">
                                                <span className="text-gray-700 font-medium">
                                                    {event?.currency}
                                                </span>
                                                {(ticket.price * quantity).toFixed(2)}
                                                <Trash className="h-4 w-4 text-gray-400 cursor-pointer hover:text-primary transition-all duration-300"
                                                    onClick={() => handleRemoveTicket(name)}
                                                />
                                            </span>
                                        </div>
                                    )
                                })}
                                {Object.values(selectedTickets).every(quantity => quantity === 0) && (
                                    <div className="text-gray-700">
                                        No tickets selected
                                    </div>
                                )}
                                <Separator className="bg-gray-200" />
                                <div className="flex justify-between text-gray-700">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
                                </div>
                                <Button
                                    className="w-full bg-primary text-white font-bold py-4 rounded-full"
                                    size="lg"
                                    disabled={calculateTotal() === 0}
                                >
                                    Continue to Payment
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}