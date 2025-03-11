"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { InvitedTeamMember, TeamMembersTableProps } from "../types";
import { Search, Pencil, Trash, Plus, Users } from "lucide-react";

interface TeamMember {
  id: number;
  email: string;
  org_name: string;
  modules: any[];
}

export default function TeamMembersTable({
  teamMembers,
  onEdit,
  onRemove,
}: TeamMembersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Members");

  const router = useRouter();

  const filteredMembers =
    teamMembers?.filter((member) => {
      const matchesSearch =
        member?.email?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
        member?.org_name?.toLowerCase()?.includes(searchQuery.toLowerCase());

      const matchesRole = true;

      return matchesSearch && matchesRole;
    }) || [];

  return (
    <div className="w-full mx-auto dark:text-white">
      <div className="flex justify-between items-stretch md:items-center space-y-5 mb-8 md:flex-row flex-col">
        <h1 className="text-4xl font-extrabold dark:text-white">
          Team Members
        </h1>
        <div className="flex md:flex-row flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 dark:bg-tertiary w-full">
            <div className="relative flex-1">
              <Search className="absolute left-1 top-1 h-7 w-7 p-2 text-white bg-primary rounded-full" />
              <Input
                placeholder="Search members"
                className="p-4 pl-10 rounded-full w-full dark:border dark:border-borderDark border-0 bg-gray-100 dark:bg-tertiary focus:border-0 focus:outline-none focus:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Button
            className="bg-primary w-full md:w-fit text-white hover:bg-red-600 rounded-full hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => router.push("/create-team-member")}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Member
          </Button>
        </div>
      </div>

      <div className="rounded-t-2xl space-y-1">
        <div className="hidden lg:grid grid-cols-5 gap-4 bg-primary text-white p-4 rounded-t-2xl">
          <div>Name</div>
          <div className="text-center">Organization</div>
          <div className="text-center">Modules</div>
          <div className="text-center">Email</div>
          <div className="text-center">Actions</div>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-tertiary rounded-b-2xl">
            <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No Team Members Found
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
              {searchQuery
                ? "No members match your current search criteria."
                : "You haven't added any team members yet."}
            </p>
            <Button
              onClick={() => router.push("/create-team-member")}
              className="bg-primary text-white hover:bg-primary/90 rounded-full"
            >
              <Plus className="mr-2 h-4 w-4" /> Add First Member
            </Button>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              className="lg:grid grid-cols-5 gap-4 space-y-3 rounded-md p-2 lg:p-4 items-center border dark:border-borderDark border-[#E8E8E8] hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="w-full flex flex-row bg-primary md:bg-transparent rounded-lg md:rounded-0 p-2 md:p-0 items-center gap-3">
                <Avatar className="w-14 h-14 md:w-10 md:h-10">
                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                  <AvatarFallback>
                    {member.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-xl md:text-base dark:text-white text-white md:text-tertiary">
                  {member.email.split("@")[0]}
                </span>
              </div>

              <div className="text-center">{member.org_name}</div>

              <div className="flex flex-wrap justify-center gap-2">
                {member.modules?.map((module: any) => (
                  <span
                    key={module.module_id}
                    className="inline-block bg-[#E5F2FC] text-[#242526] rounded-full px-4 py-2 text-sm"
                  >
                    {module.module_name}
                  </span>
                ))}
              </div>

              <div className="text-center">
                <span className="text-[#828282] font-semibold dark:text-gray-300">
                  {member.email}
                </span>
              </div>

              <div className="flex justify-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="dark:text-white text-[#6F7287]"
                  onClick={() => onEdit(member)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="dark:text-white text-[#6F7287]"
                  onClick={() => onRemove(member)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
