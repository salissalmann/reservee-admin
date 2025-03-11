"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Search, Trash, MailPlus } from "lucide-react";
import { InvitedTeamMember, TeamMembersTableProps } from "../types";
import { SafeHandlers } from "@/app/_utils/safe-handlers";

export default function InvitedMember({
  teamMembers = [],
  onEdit = () => {},
  onRemove = () => {},
}: TeamMembersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = SafeHandlers.safeFilter(
    teamMembers,
    (member) =>
      SafeHandlers.safeToLowerCase(member?.email).includes(
        SafeHandlers.safeToLowerCase(searchQuery)
      ) ||
      SafeHandlers.safeToLowerCase(member?.org_name).includes(
        SafeHandlers.safeToLowerCase(searchQuery)
      )
  );

  return (
    <div className="w-full mx-auto dark:text-white">
      <div className="flex justify-between items-stretch md:items-center space-y-5 mb-8 md:flex-row flex-col">
        <h1 className="text-4xl font-semibold dark:text-white">
          Pending Invites
        </h1>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-1 top-1 h-7 w-7 p-2 text-white bg-primary rounded-full" />
          <Input
            placeholder="Search pending invites"
            className="p-4 pl-10 rounded-full w-full dark:border dark:border-borderDark border-0 bg-gray-100 dark:bg-tertiary focus:border-0 focus:outline-none focus:ring-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value || "")}
          />
        </div>
      </div>

      <div className="rounded-t-2xl space-y-1">
        <div className="hidden lg:grid grid-cols-5 gap-4 bg-primary text-white p-4 rounded-t-2xl">
          <div>Email</div>
          <div className="text-center">Organization</div>
          <div className="text-center">Modules</div>
          <div className="text-center">Status</div>
          <div className="text-center">Actions</div>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-tertiary rounded-b-2xl">
            <MailPlus className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No Pending Invites
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
              {searchQuery
                ? "No invites match your current search criteria."
                : "You haven't sent any team member invites yet."}
            </p>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div
              key={SafeHandlers.generateSafeKey(member?.id)}
              className="lg:grid grid-cols-5 gap-4 space-y-3 rounded-md p-2 lg:p-4 items-center border dark:border-borderDark border-[#E8E8E8] hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="w-full flex flex-row bg-primary md:bg-transparent rounded-lg md:rounded-0 p-2 md:p-0 items-center gap-3">
                <Avatar className="w-14 h-14 md:w-10 md:h-10">
                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                  <AvatarFallback>
                    {SafeHandlers.getFirstChar(member?.email)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-xl md:text-base dark:text-white text-white md:text-tertiary">
                  {SafeHandlers.getSplitFirst(member?.email)}
                </span>
              </div>

              <div className="text-center">
                {SafeHandlers.getOrDefault(member?.org_name, "No Organization")}
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {SafeHandlers.safeMap(member?.modules, (module: any) => (
                  <span
                    key={SafeHandlers.generateSafeKey(module?.module_id)}
                    className="inline-block bg-[#E5F2FC] text-[#242526] rounded-full px-4 py-2 text-sm"
                  >
                    {SafeHandlers.getOrDefault(
                      module?.module_name,
                      "Unnamed Module"
                    )}
                  </span>
                ))}
              </div>

              <div className="text-center">
                <span className="inline-block bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-4 py-2 rounded-full text-sm">
                  Pending
                </span>
              </div>

              <div className="flex justify-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="dark:text-white text-[#6F7287]"
                  onClick={() => member && onEdit(member)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="dark:text-white text-[#6F7287]"
                  onClick={() => member && onRemove(member)}
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
