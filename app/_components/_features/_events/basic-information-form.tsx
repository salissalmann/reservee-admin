"use client";

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  Clock,
  DollarSign,
  Euro,
  PoundSterling,
  Type,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventState } from "@/app/_types/event-types";
import { OrganizationData } from "@/app/_types/organization-types";
import { motion } from "framer-motion";

interface BasicInfoProps {
  data: EventState["basicInfo"];
  onUpdate: (data: Partial<EventState["basicInfo"]>) => void;
  organizationId?: string | null;
  setOrganizationId?: (id: string | null) => void;
  organizations?: OrganizationData[] | null;
  mode: string;
}

const currencyIcons: Record<string, React.ReactNode> = {
  USD: (
    <DollarSign
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-100"
      size={18}
    />
  ),
  EUR: (
    <Euro
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-100"
      size={18}
    />
  ),
  GBP: (
    <PoundSterling
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-100"
      size={18}
    />
  ),
};

const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      times.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return times;
};

export default function CreateEventForm({
  data,
  onUpdate,
  organizationId,
  setOrganizationId,
  organizations,
  mode = "create",
}: BasicInfoProps) {
  const handleDateChange = (date: Date | undefined, index: number) => {
    const newDates = [...data.dates];
    newDates[index] = {
      ...newDates[index],
      date,
    };
    onUpdate({ dates: newDates });
  };

  const handleTimeChange = (
    index: number,
    type: "startTime" | "endTime",
    value: string
  ) => {
    const newDates = [...data.dates];
    newDates[index] = {
      ...newDates[index],
      [type]: value,
    };
    onUpdate({ dates: newDates });
  };

  const addNewDate = () => {
    if (data.eventType === "single" && data.dates.length > 0) return;
    onUpdate({
      dates: [...data.dates, { date: undefined, startTime: "", endTime: "" }],
    });
  };

  const removeDate = (index: number) => {
    const newDates = data.dates.filter((_, i) => i !== index);
    onUpdate({ dates: newDates });
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "start" | "end"
  ) => {
    const numericValue = e.target.value.replace(/[^0-9.]/g, "");
    onUpdate({
      price: {
        ...data.price,
        [type]: numericValue,
      },
    });
  };

  return (
    <div className="bg-white dark:bg-transparent">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full bg-white dark:bg-transparent text-black dark:text-white mx-auto shadow-xl border dark:border-borderDark border-gray-50">
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CardTitle className="text-2xl">
                Event Basic Information
              </CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-6">
            {mode === "create" && (
              <div className="space-y-2">
                <Label
                  htmlFor="event-title"
                  className="text-black dark:text-gray-100"
                >
                  Organization
                </Label>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Select
                    onValueChange={(value) =>
                      setOrganizationId ? setOrganizationId(value) : null
                    }
                    value={organizationId ?? undefined}
                    disabled
                  >
                    <SelectTrigger className="bg-white dark:bg-transparent border dark:border-borderDark border-gray-300 rounded-full">
                      <SelectValue placeholder="Select organization" />
                      <SelectContent>
                        {organizations?.map((org: any) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                </motion.div>
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="event-title"
                className="text-black dark:text-gray-100"
              >
                Event Title
              </Label>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="relative"
              >
                <Type
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-100"
                  size={18}
                />
                <Input
                  id="event-title"
                  placeholder="Event Title"
                  className="pl-10 pr-16 rounded-full bg-white dark:bg-transparent border dark:border-borderDark border-gray-300"
                  value={data.eventTitle}
                  onChange={(e) => onUpdate({ eventTitle: e.target.value })}
                  maxLength={100}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-100 text-sm">
                  {data.eventTitle.length}/100
                </span>
              </motion.div>
            </div>

            <div className="space-y-2">
              <Label className="text-black dark:text-gray-100">
                Event Type
              </Label>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Select
                  value={data.eventType}
                  onValueChange={(value: "single" | "range") => {
                    onUpdate({
                      eventType: value,
                      dates: [{ date: undefined, startTime: "", endTime: "" }],
                    });
                  }}
                >
                  <SelectTrigger className="bg-white dark:bg-transparent border dark:border-borderDark border-gray-300 rounded-full">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Day</SelectItem>
                    <SelectItem value="range">Multiple Days</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </div>

            <div className="space-y-2">
              <Label className="text-black dark:text-gray-100">
                Dates and Times
              </Label>
              <div className="space-y-4">
                {data?.dates?.map((dateInfo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="grid lg:grid-cols-[1fr_1fr_1fr_auto] gap-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="relative"
                      >
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-white dark:bg-transparent border dark:border-borderDark border-gray-300 rounded-full",
                                !dateInfo.date &&
                                  "text-gray-500 dark:text-gray-100"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateInfo.date
                                ? format(dateInfo.date, "PPP")
                                : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={dateInfo.date}
                              onSelect={(date) => handleDateChange(date, index)}
                              initialFocus
                              fromDate={new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        className="relative"
                      >
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-white dark:bg-transparent border dark:border-borderDark border-gray-300 rounded-full",
                                !dateInfo.startTime && "text-gray-500 dark:text-gray-100"
                              )}
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              {dateInfo.startTime || "Start Time"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48 p-0" align="start">
                            <div className="h-48 overflow-auto">
                              {generateTimeOptions().map((time) => (
                                <Button
                                  key={time}
                                  variant="ghost"
                                  className="w-full justify-start"
                                  onClick={() => handleTimeChange(index, "startTime", time)}
                                >
                                  {time}
                                </Button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        className="relative"
                      >
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-white dark:bg-transparent border dark:border-borderDark border-gray-300 rounded-full",
                                !dateInfo.endTime && "text-gray-500 dark:text-gray-100"
                              )}
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              {dateInfo.endTime || "End Time"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48 p-0" align="start">
                            <div className="h-48 overflow-auto">
                              {generateTimeOptions().map((time) => (
                                <Button
                                  key={time}
                                  variant="ghost"
                                  className="w-full justify-start"
                                  onClick={() => handleTimeChange(index, "endTime", time)}
                                >
                                  {time}
                                </Button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </motion.div>

                      {data.dates.length > 1 && (
                        <div className="bg-red-100 flex items-center justify-center rounded-full cursor-pointer hover:scale-105 transition-all duration-300">
                          <Button
                            variant="ghost"
                            onClick={() => removeDate(index)}
                            className="px-3 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          ×
                        </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {(data.eventType === "range" || data.dates.length === 0) && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <Button
                      variant="outline"
                      onClick={addNewDate}
                      className="w-full justify-start text-left font-normal bg-white dark:bg-transparent border dark:border-borderDark border-gray-300 rounded-full"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Add Another Date
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-black dark:text-gray-100">
                Price Range
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="relative"
                >
                  {currencyIcons[data.price.currency]}
                  <Input
                    placeholder="Starting Price"
                    className="pl-10 rounded-full bg-white dark:bg-transparent border dark:border-borderDark border-gray-300"
                    value={data.price.start}
                    onChange={(e) => handlePriceChange(e, "start")}
                    type="number"
                    step="0.01"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="relative"
                >
                  {currencyIcons[data.price.currency]}
                  <Input
                    placeholder="Closing Price"
                    className="pl-10 rounded-full bg-white dark:bg-transparent border dark:border-borderDark border-gray-300"
                    value={data.price.end}
                    onChange={(e) => handlePriceChange(e, "end")}
                    type="number"
                    step="0.01"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Select
                    value={data.price.currency}
                    onValueChange={(value) =>
                      onUpdate({ price: { ...data.price, currency: value } })
                    }
                  >
                    <SelectTrigger className="bg-white dark:bg-transparent border dark:border-borderDark border-gray-300 rounded-full">
                      <SelectValue placeholder="Pick Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
