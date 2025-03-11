// Types
export interface DateTime {
    date: Date | undefined;
    startTime: string;
    endTime: string;
}

export interface Price {
    start: string;
    end: string;
    currency: string;
}

export interface BasicInfo {
    eventTitle: string;
    eventType: "single" | "range";
    dates: DateTime[];
    price: Price;
    organizationName?: string;
}

export interface EventState {
    basicInfo: BasicInfo;
    images: { files: File[] };
    video: File | null;
    location: {
        venueName: string;
        venueAddress: string;
        coordinates: { lat: number; lng: number };
    };
    description: {
        summary: string;
        tags: string[];
    };
}

export interface TicketType {
    name: string;
    price: number;
    description: string;
    quantity: number;
    id?: number;
}

export interface IEvent {
    id?: string;
    event_title: string;
    event_type: string;
    date_times: { date: string | undefined, stime: string, etime: string }[];
    price_starting_range: string;
    price_ending_range: string;
    currency: string;
    is_published?: boolean;
    is_disabled?: boolean;
    organization_name?: string;
    images?: { files: { id: string; file: File; preview: string; isCover: boolean; focusPoint: { x: number; y: number } }[] };
    video?: File | null;
    venue_name?: string;
    venue_address?: string;
    venue_coords?: { latitude: number | null; longitude: number | null };
    event_desc?: string;
    tickets?: TicketType[];
    venue_config?: string;
    ticket_types?: TicketType[];
    created_at?: string;
    updated_at?: string;
    event_tags?:number[]
    is_featured?:boolean
    org_id?:number|string
}

export interface EventStateEdit {
  basicInfo: {
    eventTitle: string;
    eventType: 'single' | 'range';
    dates: Array<{
      date: Date | undefined;
      startTime: string;
      endTime: string;
    }>;
    price: {
      start: string;
      end: string;
      currency: string;
    };
    organizationName?:string
  };
  images: {
    files: Array<{
      id: string;
      file: File;
      preview: string;
      isCover: boolean;
      focusPoint: { x: number; y: number };
    }>;
  };
  video: File | null ;
  location: {
    venueName: string;
    venueAddress: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  description: {
    summary: string;
    tags: string[];
  };
  gallery?: string[];
  tickets?: TicketType[];
  venue_config?: string;
  // org_id?: string | null;
}
