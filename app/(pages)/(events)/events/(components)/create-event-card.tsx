'use client'
import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Pencil, Plus } from 'lucide-react'
import Button from '@/app/_components/_layout-components/button'
import { useRouter } from 'next/navigation'

export default function CreateEventCard({ organizationId }: { organizationId?: string }) {
    const router = useRouter()


    return (
        <Card className="w-full mx-auto border shadow-lg dark:border-borderDark border-gray-50 flex flex-col md:flex-row justify-between mb-4 dark:bg-tertiary bg-white">
            <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center md:items-start justify-center md:justify-start gap-2">
                        <Pencil className="h-6 w-6 text-red-500" />
                        <h2 className="text-2xl font-bold">Start From Scratch!</h2>
                    </div>
                    <p className="text-center text-sm">
                        Add your event details, create new tickets
                        and set up recurring events.
                    </p>
                </div>
            </CardContent>
            <CardFooter className="pb-6 flex justify-center">
                <Button btnStyle="rounded-fill" icon={<Plus className="mr-2 h-4 w-4" />}
                    onClick={() => {
                        if (organizationId) {
                            router.push(`/create-event?organizationId=${organizationId}`)
                        } else {
                            router.push('/create-event')
                        }
                    }}
                >
                    Create Event
                </Button>
            </CardFooter>
        </Card>
    )
}