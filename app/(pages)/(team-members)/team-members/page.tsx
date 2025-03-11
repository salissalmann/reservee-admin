"use client";

import { useState } from "react";
  ;
import { motion } from "framer-motion";
import TeamMembersTable from "./(components)/team-members-table";
import InvitedMember from "./(components)/invited-member";
import { InvitedTeamMember } from "./types";
import { useSearchParams } from "next/navigation";
import { useTeamInvitations } from "@/app/_hooks/_organizations/useTeamInvitations";

export default function TeamMembersDashboard() {
  const [editingMember, setEditingMember] = useState<InvitedTeamMember | null>(
    null
  );

  const searchParams = useSearchParams();
  const org_id = searchParams.get("org_id");

  const { invites, isLoading, error } = useTeamInvitations({
    org_id,
    page: 1,
    limit: 10,
  });

  const acceptedMembers =
    invites?.filter((invite) => invite?.invitation_status === "Accepted") || [];

  const pendingInvites =
    invites?.filter((invite) => invite?.invitation_status !== "Accepted") || [];

  const handleEdit = (member: InvitedTeamMember) => {
    setEditingMember(member);
  };

  const handleRemove = (memberId: InvitedTeamMember) => {
    // Implement remove functionality
  };

  return (
    <div className="min-h-screen bg-white dark:bg-tertiary">
      {/* <Navigation showSecondaryNav={true} /> */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="dark:bg-tertiary rounded-xl mx-auto space-y-10"
        >
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                <TeamMembersTable
                  teamMembers={acceptedMembers}
                  onEdit={handleEdit}
                  onRemove={handleRemove}
                />
              </div>

              <div className="space-y-6">
                <InvitedMember
                  teamMembers={pendingInvites}
                  onEdit={handleEdit}
                  onRemove={handleRemove}
                />
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
