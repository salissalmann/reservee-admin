import { CalendarDays, Clock3 } from "lucide-react";
import Image from "next/image";
import React from "react";

const EventBanner = () => {
  return (
    <div className="bg-tertiary dark:bg-gray-700 text-white p-6 rounded-xl mb-6 relative overflow-hidden">
      <div className=" flex flex-col md:flex-row gap-5 items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Desktop View */}
          <div className="relative hidden md:block w-44 h-32 bg-gray-800  rounded-xl overflow-hidden">
            <Image
              src={"/images/events/new-event-2.jpeg"}
              alt="events"
              className=" w-full h-full max-w-full max-h-full object-cover"
              fill
            />
          </div>
          {/* ================= */}
          {/* Mobile View */}
          {/* ================= */}

          <Image
            src={"/images/events/new-event-2.jpeg"}
            fill
            objectFit="cover"
            alt="events"
            className="absolute block md:hidden"
          />
          <div className="absolute block md:hidden top-0 left-0 right-0 bottom-0 w-full h-full bg-tertiary opacity-90"></div>

          <div className="relative">
            <h1 className="text-2xl justify-center md:justify-start font-bold flex items-center gap-2">
              Father John Misty
              <span className="text-gray-400">@</span>
            </h1>
            <p className="text-gray-100 text-center md:text-left">
              Aslam Business Marketing Events Pakistan
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 relative">
          <div className="text-right md:w-52 flex justify-center items-center gap-2 border p-2 rounded-lg border-primary md:border-[#6D9EFF1A]">
            <CalendarDays className="text-primary hidden md:block" />
            <p className="text-white">April, 14</p>
          </div>
          <div className="text-right flex items-center justify-center gap-2 border p-2 rounded-lg border-primary md:border-[#6D9EFF1A] md:w-52">
            <Clock3 className="text-primary hidden md:block" />
            <p className="text-lg">15:10</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBanner;
