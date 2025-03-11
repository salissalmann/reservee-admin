import EventDetails from "@/app/_components/_features/_events/edit-event";

export const runtime = "edge";

const EventPage = ({ params }: { params: { id: string } }) => {
  const eventId = params.id;
  return <EventDetails eventId={eventId} />;
};

export default EventPage;
