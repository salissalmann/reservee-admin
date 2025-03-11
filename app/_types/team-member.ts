interface TeamMember {
    id: number;
    name: string;
    email: string;
    organization_roles: string[];
    event_roles: string[];
}

 interface InvitedTeamMember {
    id: number;
    email: string;
    role_id: number;
    message: string;
    link_id: string;
    invitation_status: string;
    is_used: boolean;
    is_disabled: boolean;
    is_deleted: boolean;
    org_id: number;
    event_id: number;
    org_name: string;
    created_by: number;
    created_at: string;
    modules: number[];
  }
  
export type { TeamMember, InvitedTeamMember };