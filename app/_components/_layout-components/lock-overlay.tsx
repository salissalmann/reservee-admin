"use client";

import { Lock } from "lucide-react";
import React from "react";

interface LockOverlayProps {
  message?: string;
  isLocked?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const LockOverlay = ({
  message = "This feature is currently locked",
  isLocked = true,
  children,
  className = "",
}: LockOverlayProps) => {
  if (!isLocked) return <>{children}</>;

  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="absolute inset-0 backdrop-blur-[2px] bg-white/60 dark:bg-black/60 flex flex-col items-center justify-center z-50">
        <div className="bg-white dark:bg-tertiary shadow-lg rounded-xl p-6 max-w-[90%] w-auto mx-4 text-center space-y-3">
          <div className="mx-auto w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Access Locked</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LockOverlay;
