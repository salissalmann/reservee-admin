export interface NotificationButton {
    text: string;
    url: string;
    color: string;
    icon?: "WARNING" | "INFO" | "SUCCESS" | "ERROR";
  }
  
  export interface Notification {
    id: number;
    user_id: number;
    color_scheme: string;
    icon_type: "WARNING" | "INFO" | "SUCCESS" | "ERROR";
    title: string;
    description: string;
    buttons?: NotificationButton[];
    created_at: string;
    is_read: boolean;
    type?: 'USER' | 'VENDOR' | 'ADMIN' | 'ALL';
  }
  

  
  