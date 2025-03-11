import { useState, useEffect } from "react";
import { GetOrganizationTeamInvitationAPI } from "@/app/_apis/team-invitation-api";
import { InvitedTeamMember } from "@/app/_types/team-member";

interface UseTeamInvitationsProps {
  org_id: string | null;
  event_id?: string | null;
  page?: number;
  limit?: number;
}

interface ApiState {
  loading: boolean;
  error: Error | null;
}

export const useTeamInvitations = ({ org_id, event_id, page = 1, limit = 10 }: UseTeamInvitationsProps) => {
  const [invites, setInvites] = useState<InvitedTeamMember[]>([]);
  const [apiState, setApiState] = useState<ApiState>({
    loading: false,
    error: null,
  });

  useEffect(() => {
    const fetchTeamInvitations = async () => {
      if (!org_id) {
        setApiState(prev => ({ ...prev, error: new Error("Organization ID is required") }));
        return;
      }

      setApiState(prev => ({ ...prev, loading: true }));

      try {
        const response = await GetOrganizationTeamInvitationAPI({
          org_id,
          event_id,
          page,
          limit,
        });

        if (response?.statusCode === 200) {
          const invitations = response?.data?.invitations;
          setInvites(invitations);
        }
      } catch (error) {
        setApiState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error : new Error("Failed to fetch team invitations") 
        }));
      } finally {
        setApiState(prev => ({ ...prev, loading: false }));
      }
    };

    fetchTeamInvitations();
  }, [org_id, event_id, page, limit]);

  return {
    invites,
    isLoading: apiState.loading,
    error: apiState.error,
  };
};
