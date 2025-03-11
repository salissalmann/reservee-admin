import { TeamMember } from "@/app/_types/team-member"

interface Invite {
  id: number;
  email: string;
  organization_roles: string[];
  event_roles: string[];
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  sent_at: Date;
}

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (
    email: string,
    organization_roles: string[],
    event_roles: string[]
  ) => void;
}

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    memberId: number,
    organization_roles: string[],
    event_roles: string[]
  ) => void;
  member: TeamMember | null;
}
interface TeamMembersTableProps {
  teamMembers: InvitedTeamMember[];
  onEdit: (member: InvitedTeamMember) => void;
  onRemove: (memberId: InvitedTeamMember) => void;
}
const constants = {
  OrganizationRoles: [
    "Administrator",
    "Organization Team Member",
    "Organization Edit Access",
  ],
  EventRoles: [
    "Event Team Member",
    "Event Edit Access",
    "Event Analytics",
    "Event Invite Access",
    "Orders Management",
  ],
};

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

export type {
  Invite,
  EditMemberModalProps,
  InviteMemberModalProps,
  TeamMembersTableProps,
  InvitedTeamMember,
};

export { constants };
