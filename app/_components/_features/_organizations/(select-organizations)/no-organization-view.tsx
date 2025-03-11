import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Calendar } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Button from "@/app/_components/_layout-components/button";

const NoOrganizationView = () => {
    const router = useRouter();
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-2xl font-bold">Welcome to Your Dashboard!</h1>
                <p className="text-gray-400 text-sm">
                    Manage your events, team, and organization effortlessly in one place.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6">
                <div className="flex flex-col space-y-4">
                    <Card className="lg:col-span-1 dark:bg-tertiary border dark:borderDark border-gray-100">
                        <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                            <Building2 className="w-12 h-12 text-blue-500" />
                            <p className="text-gray-400 text-center text-sm">
                                Start by creating your organization to manage events and team
                                members efficiently.
                            </p>
                            <Button
                                className="w-full text-white !text-sm"
                                btnStyle="rounded-fill"
                                onClick={() => router.push("/create-organization")}
                            >
                                Create Your Organization
                            </Button>
                        </CardContent>
                    </Card>
                    <div className="flex flex-col md:flex-row space-x-4">
                        <Card className="dark:bg-tertiary border dark:borderDark border-gray-100">
                            <CardContent className="p-6 flex flex-col items-center justify-center w-full space-y-4">
                                <Users className="w-8 h-8 text-blue-500" />
                                <h3 className="text-xl font-semibold">Add Team Member</h3>
                                <p className="text-gray-400 text-center text-sm">
                                    Invite and manage team members to help with your event
                                    planning.
                                </p>
                                <Button
                                    className="w-full !text-sm"
                                    btnStyle="rounded-fill"
                                    btnCover="secondary-button"
                                    onClick={() => router.push("/team-members")}
                                >
                                    Manage Team Members
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="dark:bg-tertiary border dark:borderDark border-gray-100">
                            <CardContent className="p-6 flex flex-col items-center justify-center w-full space-y-4">
                                <Calendar className="w-8 h-8 text-blue-500" />
                                <h3 className="text-xl font-semibold">Create New Event</h3>
                                <p className="text-gray-400 text-center text-sm">
                                    Get started with organizing your next event. Set up details,
                                    ticket types, and more.
                                </p>
                                <Button
                                    className="w-full !text-sm"
                                    btnStyle="rounded-fill"
                                    btnCover="secondary-button"
                                    onClick={() => router.push("/create-event")}
                                >
                                    Create New Event
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Card className="dark:bg-tertiary border dark:borderDark border-gray-100">
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold">Your checklist</h2>
                                <p className="text-gray-500 text-sm">
                                    We make it easy to plan successful events. Here's how to
                                    start!
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 p-4 rounded-md border border-gray-200">
                                    <Checkbox id="organization" />
                                    <div>
                                        <label
                                            htmlFor="organization"
                                            className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Create Organization
                                        </label>
                                        <p className="text-xs text-gray-500">
                                            Publish an event to meet millions of people on{" "}
                                            <span>
                                                get <span className="text-primary">{">"}</span> in
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-4 rounded-md border border-gray-200">
                                    <Checkbox id="team" />
                                    <div>
                                        <label
                                            htmlFor="team"
                                            className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Add Your Team Members
                                        </label>
                                        <p className="text-xs text-gray-500">
                                            Get paid for future ticket sales by entering your bank
                                            details
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-4 rounded-md border border-gray-200">
                                    <Checkbox id="event" />
                                    <div>
                                        <label
                                            htmlFor="event"
                                            className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Create New Event
                                        </label>
                                        <p className="text-xs text-gray-500">
                                            Highlight your brand by adding your organizer a name,
                                            image and bio
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};


export default NoOrganizationView;