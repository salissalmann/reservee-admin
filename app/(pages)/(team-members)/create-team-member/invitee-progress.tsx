import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2, Pencil, Trash2 } from "lucide-react";

export default function InviteeProgress() {
  return (
    <div className="space-y-4 max-w-md w-full">
      {/* Info Section */}
      <Card className="p-6 border border-gray-200 dark:border-borderDark bg-white dark:bg-tertiary">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-2 rounded-full bg-blue-50">
            <Link2 className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-muted-foreground text-sm">
            You're just a step away from unlocking all the tools to manage your
            events and teams. If you're not sure about some details, you can
            always come back and edit this later.
          </p>
        </div>
      </Card>
    </div>
  );
}
