import EventOveriewLayout from "@/app/_components/_features/_events/event-overview";
import React from "react";

export const runtime = 'edge';

const page = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <EventOveriewLayout eventId={params.id} />
    </>
  );
};

export default page;
