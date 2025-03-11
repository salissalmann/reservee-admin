interface Query {
  id: number;
  user_query: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  event_name: string;
  status: "pending" | "answered" | "completed" | "faq" | "rejected";
  response: string | null;
  user_id: number;
  event_id: number;
  created_at: string;
  is_disabled: boolean;
  is_deleted: boolean;
}

interface QueryResponse {
  status: boolean;
  message: string;
  data: Query[];
}

interface QueryUpdateResponse {
  status: boolean;
  message: string;
  data: Query;
}

export type { Query, QueryResponse, QueryUpdateResponse };
