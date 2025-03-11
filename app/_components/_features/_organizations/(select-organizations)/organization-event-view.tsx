import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ListIcon, CalendarIcon, Search, Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input"
import { format } from "date-fns";
import CreateEventCard from "@/app/(pages)/(events)/events/(components)/create-event-card"
import EventCards from "@/app/(pages)/(events)/events/(components)/event-card";
import { axiosErrorHandler } from "@/app/_utils/utility-functions";
import toast from "react-hot-toast";
import { IEvent } from "@/app/_types/event-types";
import { rootPath } from "@/app/_constants/config";
import apiClient from "@/app/_utils/axios";
import NoEventsCard from "@/app/_components/_features/_organizations/(select-organizations)/no-events-card";

const Events = ({ organizationId }: { organizationId: string }) => {

    const [searchQuery, setSearchQuery] = React.useState("")
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date())
    const [viewType, setViewType] = React.useState("list")
    const [timeFilter, setTimeFilter] = React.useState("All Events")

    const [events, setEvents] = React.useState<IEvent[]>([])

    const filteredEvents = React.useMemo(() => {
        const now = new Date()

        return events.filter(event => {
            // Search filter
            const matchesSearch = event.event_title.toLowerCase().includes(searchQuery.toLowerCase())

            // Check if any of the event dates match the filters
            const matchesDateCriteria = event.date_times.some(dateTime => {
                const eventDate = dateTime.date ? new Date(dateTime.date) : null

                // Skip events with invalid dates
                if (!eventDate) return false

                const matchesTimeFilter = timeFilter === "All Events" ||
                    (timeFilter === "Upcoming Events" && eventDate >= now) ||
                    (timeFilter === "Past Events" && eventDate < now)

                // Calendar date filter - compare only if we're in calendar view and have a selected date
                const matchesDate = viewType !== "calendar" || !selectedDate ||
                    (format(eventDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))

                return matchesTimeFilter && matchesDate
            })

            return matchesSearch && matchesDateCriteria
        })
    }, [events, searchQuery, timeFilter, viewType, selectedDate])
    const [loading, setLoading] = React.useState(true);
    const getEvents = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`${rootPath}/get-events-by-org-id/${organizationId}`)
            if (response.data.statusCode === 200) {
                const sortedEvents = response.data.data.sort((a: IEvent, b: IEvent) => {
                    const dateA = a.date_times[0].date ? new Date(a.date_times[0].date).getTime() : 0
                    const dateB = b.date_times[0].date ? new Date(b.date_times[0].date).getTime() : 0
                    return dateA - dateB
                })
                setEvents(sortedEvents)
            }
            else {
                toast.error(response.data.message)
            }
        } catch (error) {
            axiosErrorHandler(error, "Error fetching events")
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        getEvents()
    }, [])

    const handleSelect = (date: Date | undefined) => {
        setSelectedDate(date)
    }

    return (
        <>
            {loading ?
                <div className="flex justify-center items-center min-h-[20rem] shadow-xl">
                    <div className="flex flex-row flex-wrap justify-center items-center gap-4">
                        <Loader className="w-5 h-5 animate-spin" />
                        <p className="text-md text-gray-500 dark:text-gray-300">Loading events...</p>
                    </div>
                </div> :

                <>
                    {events.length === 0 ?
                        <NoEventsCard /> :
                        <Tabs value={viewType} onValueChange={setViewType} >
                            <div className="flex flex-row flex-wrap justify-start gap-4">
                                <div className="flex flex-col sm:flex-row gap-4 dark:bg-tertiary">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-1 top-1 h-7 w-7 p-2 text-white bg-primary rounded-full" />
                                        <Input
                                            placeholder="Search events"
                                            className="p-4 pl-10 rounded-full w-full dark:border dark:border-borderDark border-0 bg-gray-100 dark:bg-tertiary focus:border-0 focus:outline-none focus:ring-0"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <TabsList className="dark:bg-tertiary dark:border dark:border-borderDark">
                                    <TabsTrigger value="list" className="text-sm">
                                        <ListIcon className="mr-2 h-4 w-4" />
                                        List View
                                    </TabsTrigger>
                                    <TabsTrigger value="calendar">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        Calendar View
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="list" className="space-y-4 mt-6">
                                <CreateEventCard organizationId={organizationId} />
                                <EventCards eventsToRender={filteredEvents} getEvents={getEvents} />
                            </TabsContent>

                            <TabsContent value="calendar">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Card className="dark:bg-tertiary bg-white border dark:border-borderDark border-gray-50">
                                        <CardContent className="p-0">
                                            <Calendar
                                                mode="single"
                                                selected={selectedDate}
                                                onSelect={handleSelect}
                                                className="rounded-md"
                                            />
                                        </CardContent>
                                    </Card>
                                    <div className="space-y-4">
                                        <h3 className="font-semibold">
                                            Events for {selectedDate ? format(selectedDate, 'PPP') : 'Selected Date'}
                                        </h3>
                                        <EventCards eventsToRender={filteredEvents} getEvents={getEvents} />
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs >
                    }
                </>
            }</>

    )
}


export default Events;