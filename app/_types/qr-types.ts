// Types
export interface TicketData {
    id: string
}

export interface ScannerProps {
    onScanSuccess: (ticketId: string) => void
    isLoading: boolean
    isScanning: boolean
    setIsScanning: (value: boolean) => void
}

export interface ManualEntryProps {
    onSubmit: (ticketId: string) => void
    isLoading: boolean
}

export interface FileUploadProps {
    onUploadSuccess: (ticketId: string) => void
    isLoading: boolean
    setScanError: (error: string | null) => void
}

export interface SeatMapDetail {
    area_name: string;
    area_id: string;
    seat_number: string;
}

export interface QRCode {
    seat_number?: string;
    area_id?: string;
    ticket_id?: string;
    ticket_qty_index?: number;
    is_scanned: boolean;
}

export interface OrderItem {
    id: string;
    ticket_id: string;
    type: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    created_at: string;
    type?: 'seatmap' | 'regular';
    user_email?: string;
    user_phone?: string;
    age?: number;
    dob?: string;
    gender?: string;
    seatMapDetails?: SeatMapDetail[];
    orderItems?: OrderItem[];
    qrCodes: QRCode[];
}

export interface EventDetails {
    event_title: string
    currency: string
}