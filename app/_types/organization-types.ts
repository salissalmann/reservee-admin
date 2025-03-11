export interface OrganizationData {
    id?: string;
    name: string;
    description: string;
    logo: string | null;
    logoFile?: File | null;
    categories: number[];
    newLogoFile?: File | null;
}

export interface ValidationRule {
    condition: boolean;
    message: string;
}

export interface InvitedOrganizationData {
    id: string;
    organization_id?: string;
    organization_name?: string;
    role_name?: string;
    event_id?: number;
    event_name?: string;
    invited?: boolean;
    logo?:string;
    organization_logo?:string;
    modules: {
      front_end_routes: string[];
      name?: string;
    }[];
  }