"use client";

import ErrorModal from "./error-modal";
import { useErrorModalStore } from "@/app/_store/error-modal-store";

export default function RouteAccessErrorModal() {
  const { isOpen, title, message, closeError, canDismiss, redirectPath } =
    useErrorModalStore();

  return (
    <ErrorModal
      isOpen={isOpen}
      onClose={closeError}
      title={title}
      message={message}
      canDismiss={canDismiss}
      redirectPath={redirectPath}
    />
  );
}
