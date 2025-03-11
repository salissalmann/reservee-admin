"use client";

import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  canDismiss?: boolean;
  redirectPath?: string;
}

export default function ErrorModal({
  isOpen,
  onClose,
  title,
  message,
  canDismiss = true,
  redirectPath,
}: ErrorModalProps) {
  const router = useRouter();

  const handleRedirect = () => {
    if (redirectPath) {
      router.push(redirectPath);
      onClose();
    } else {
      router.back();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={canDismiss ? onClose : handleRedirect}>
      <DialogContent
        className={`sm:max-w-[425px] bg-white dark:bg-tertiary backdrop-blur-md ${
          !canDismiss ? "dialog-no-close" : ""
        }`}
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <DialogTitle className="text-tertiary dark:text-white">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {canDismiss ? (
            <Button
              variant="outline"
              onClick={onClose}
              className="dark:border-borderDark dark:text-white dark:hover:bg-borderDark"
            >
              Close
            </Button>
          ) : redirectPath ? (
            <Button
              variant="default"
              onClick={handleRedirect}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Go to Dashboard
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
