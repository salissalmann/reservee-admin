import { Loader2 } from "lucide-react";
import { Info } from "lucide-react";

// Types
interface Step {
    number: string;
    label: string;
    status: "active" | "upcoming";
    index: number;
  }
  
export const STEPS: Step[] = [
    { number: "01", label: "Info", status: "active", index: 0 },
    { number: "02", label: "Images", status: "upcoming", index: 1 },
    { number: "03", label: "Location", status: "upcoming", index: 2 },
    { number: "04", label: "Seatmap & Tickets", status: "upcoming", index: 3 },
    { number: "05", label: "Description", status: "upcoming", index: 4 },
    { number: "06", label: "Preview", status: "upcoming", index: 5 },
];

// Loading Component
export const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center py-8">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
);



// Component for unauthorized state
export const UnauthorizedState: React.FC = () => (
    <div className="w-full md:w-[75%] mx-auto px-4 py-6 min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
            <Info className="w-12 h-12 text-primary" />
            <h1 className="text-2xl font-bold">
                You are not authorized to edit this event.
            </h1>
            <p className="text-gray-400 text-sm">
                Please contact the event organizer for more information.
            </p>
        </div>
    </div>
);

// Component for loading state
export const LoadingState: React.FC = () => (
    <div className="w-full md:w-[75%] mx-auto px-4 py-6 min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
            <Info className="w-12 h-12 text-primary" />
            <h1 className="text-2xl font-bold">Loading event details...</h1>
            <p className="text-gray-400 text-sm">
                Please wait while we load the event details.
            </p>
        </div>
    </div>
);

// Stepper Header Component
export const StepperHeader: React.FC<{
    currentStep: number;
    onStepClick: (index: number) => void;
}> = ({ currentStep, onStepClick }) => (
    <div className="w-full md:w-[75%] mx-auto px-4 py-6">
        <div className="relative flex justify-between">
            <div className="absolute top-5 left-0 right-0 h-[1px] bg-gray-200 dark:bg-borderDark" />
            {STEPS.map((step) => (
                <div
                    key={step.number}
                    className="relative flex flex-row items-center cursor-pointer"
                    onClick={() => onStepClick(step.index)}
                >
                    <div
                        className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 
                ${step.index === currentStep
                                ? "border-primary bg-primary text-white"
                                : "dark:border-borderDark border-gray-200 dark:bg-tertiary bg-white text-gray-400 dark:text-gray-200"
                            }`}
                    >
                        {step.number}
                    </div>
                    <span
                        className={`md:block hidden ml-2 text-sm font-bold 
                ${step.index === currentStep
                                ? "bg-white text-primary dark:bg-tertiary"
                                : "bg-white dark:bg-tertiary text-gray-400 dark:text-gray-200"
                            }`}
                    >
                        {step.label}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

// Navigation Buttons Component
export const NavigationButtons: React.FC<{
    stepper: number;
    onBack: () => void;
    onNext: () => void;
    isSubmitting: boolean;
}> = ({ stepper, onBack, onNext, isSubmitting }) => (
    <div className="flex flex-col md:flex-row justify-center mt-10 mb-20 p-8 pt-0 md:p-0 gap-4">
        <button
            className="md:w-[12rem] w-full border border-primary text-primary px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer font-bold"
            onClick={onBack}
        >
            Back
        </button>
        <button
            className="md:w-[12rem] w-full border border-primary text-white bg-primary px-4 py-2 rounded-full hover:bg-white hover:text-primary transition-all duration-300 cursor-pointer font-bold"
            onClick={onNext}
        >
            {stepper === STEPS.length - 1
                ? isSubmitting
                    ? "Saving..."
                    : "Submit"
                : "Next"}
        </button>
    </div>
);
