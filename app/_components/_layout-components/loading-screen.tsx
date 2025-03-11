import { LoaderIcon } from "lucide-react";

interface LoadingScreenProps {
  title: string;
  description: string;
}

const LoadingScreen = ({ title, description }: LoadingScreenProps) => (
  <>
    <div className="pb-24 pt-10 dark:bg-tertiary bg-white dark:text-white p-6 min-h-[calc(100vh-20rem)] flex items-center justify-center">
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <LoaderIcon className="text-black dark:text-white h-7 w-7 animate-spin" />
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-primary">{title}</h2>
          <p className="text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  </>
);
