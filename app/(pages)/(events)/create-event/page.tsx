"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Building2, Plus } from "lucide-react";
import { useSelector } from "react-redux";

const Navigation = dynamic(
  () => import("@/app/_components/_layout-components/navigation"),
  { ssr: false }
);
const Footer = dynamic(
  () => import("@/app/_components/_layout-components/footer"),
  { ssr: false }
);
const CreateEventForm = dynamic(
  () => import("@/app/_components/_features/_events/basic-information-form"),
  { ssr: false }
);
const Button = dynamic(
  () => import("@/app/_components/_layout-components/button"),
  { ssr: false }
);
const Card = dynamic(
  () => import("@/components/ui/card").then((mod) => mod.Card),
  { ssr: false }
);
const CardContent = dynamic(
  () => import("@/components/ui/card").then((mod) => mod.CardContent),
  { ssr: false }
);

import { selectOrganizationId } from "@/app/_utils/redux/organizationSlice";
import { useOrganization } from "@/app/_hooks/_organizations/useCheckOrganization";
import Loader from "@/app/_components/_layout-components/loader";
import useEventDataCreate from "@/app/_hooks/_events/(create-event)/useEventDataCreate";
import useEventSubmission from "@/app/_hooks/_events/(create-event)/useEventSubmission";

export default function CreateEventPage() {
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const organization_Id = useSelector(selectOrganizationId);
  const { loading, organizationExists, organizations } = useOrganization();
  const { eventData, updateEventData } = useEventDataCreate();
  const { isSubmitting, handleSubmit } = useEventSubmission(
    eventData,
    organizationId
  );
  const router = useRouter();

  useEffect(() => {
    if (organization_Id) {
      setOrganizationId(organization_Id);
    }
  }, [organization_Id]);

  if (loading) return <Loader />;

  if (!organizationExists || !organizations?.length) {
    return (
      <>
        <div className="w-full md:w-[90%] width-change mx-auto px-4 min-h-[calc(100vh-20rem)]">
          <div className="flex flex-col items-center justify-center mb-8">
            <h1 className="text-2xl md:text-4xl font-bold mt-8">
              Create Organization First
            </h1>
            <h4 className="text-muted-foreground mt-2">
              Create your organization and manage your events
            </h4>
          </div>
          <Card className="flex h-[400px] items-center justify-center bg-white dark:bg-tertiary border border-gray-200 dark:border-borderDark">
            <CardContent className="text-center flex flex-col gap-4">
              <div className="flex flex-col items-center justify-center">
                <Building2 className="w-10 h-10 text-blue-500" />
              </div>
              <p className="mb-4 text-muted-foreground">
                Start a new organization to manage events.
              </p>
              <div className="flex justify-center">
                <Button
                  btnStyle="rounded-fill"
                  btnCover="primary-button"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => router.push("/create-organization")}
                >
                  Create New Organization
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="w-full md:w-[90%] width-change mx-auto px-4 min-h-[calc(100vh-20rem)]">
        <h1 className="text-4xl font-bold mt-8">
          Create Event for{" "}
          <span className="text-primary">
            {organizations?.find((org: any) => org.id === organizationId)
              ?.name || "None Selected"}
          </span>
        </h1>
        <h4 className="text-muted-foreground mt-2">
          Create your event and manage your attendees
        </h4>

        <div className="grid grid-cols-1 mt-4 gap-4">
          <CreateEventForm
            organizationId={organizationId}
            setOrganizationId={setOrganizationId}
            organizations={
              organizations?.map((org) => ({
                ...org,
                logoFile: org.logoFile || null,
              })) || []
            }
            data={eventData.basicInfo}
            onUpdate={(data) => updateEventData("basicInfo", data)}
            mode="create"
          />
        </div>

        <div className="flex flex-col md:flex-row justify-end mt-10 mb-40 p-8 pt-0 md:p-0 gap-4">
          <button
            className="md:w-[12rem] w-full border border-primary text-primary px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer font-bold"
            onClick={() => router.back()}
          >
            Back
          </button>
          <button
            className="md:w-[12rem] w-full border border-primary text-white bg-primary px-4 py-2 rounded-full hover:bg-white hover:text-primary transition-all duration-300 cursor-pointer font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </>
  );
}
