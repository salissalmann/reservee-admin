"use client";

import { Pencil, Trash, Plus, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import {
  CreateFaq,
  GetAllFaqs,
  UpdateFAQ,
  DeleteFAQ,
  GetFaqsByEventId,
} from "@/app/_apis/queries-apis";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { axiosErrorHandler } from "@/app/_utils/utility-functions";

// Define the FAQ type with additional fields from the API response
interface FAQ {
  id?: number;
  question: string;
  answer: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
  event_id?: number | null;
}

export default function FAQSection({ event_id }: { event_id: string }) {
  // State for FAQs and loading
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for create/edit modal
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [currentFaq, setCurrentFaq] = useState<FAQ>({
    question: "",
    answer: "",
    status: "active",
  });

  // State for delete confirmation
  const [faqToDelete, setFaqToDelete] = useState<FAQ | null>(null);

  // Fetch FAQs
  const fetchFaqs = async () => {
    try {
      setIsLoading(true);
      const response = await GetFaqsByEventId(event_id);
      // const response = await GetAllFaqs();
      const data = response?.data || [];

      // Optional: Filter FAQs by event_id if needed
      const filteredFaqs = data?.filter(
        (faq: FAQ) => faq?.event_id === Number(event_id) || !faq?.event_id
      );

      setFaqs(filteredFaqs);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      // toast.error("Failed to load FAQs");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Create/Update FAQ
  const handleSubmitFaq = async () => {
    // Validate input
    if (!currentFaq.question.trim()) {
      setCreateError("Question cannot be empty");
      return;
    }
    if (!currentFaq.answer.trim()) {
      setCreateError("Answer cannot be empty");
      return;
    }

    try {
      setIsCreating(true);
      setCreateError(null);

      const faqData = {
        question: currentFaq.question.trim(),
        answer: currentFaq.answer.trim(),
        status: currentFaq.status,
        event_id: Number(event_id),
      };

      if (isEditing && currentFaq.id) {
        // Update existing FAQ
        const updatedFaq = await UpdateFAQ(currentFaq.id, faqData);

        // Locally update the FAQ in the list
        setFaqs((prevFaqs) =>
          prevFaqs.map((faq) =>
            faq.id === currentFaq.id ? { ...faq, ...updatedFaq.data } : faq
          )
        );

        toast.success("FAQ updated successfully");
      } else {
        // Create new FAQ
        const newFaq = await CreateFaq(faqData);

        // Add the new FAQ to the list
        setFaqs((prevFaqs) => [...prevFaqs, newFaq.data]);

        toast.success("New FAQ created successfully");
      }

      // Reset form and close dialog
      setIsDialogOpen(false);
      setCurrentFaq({ question: "", answer: "", status: "active" });
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting FAQ:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      axiosErrorHandler(
        error,
        isEditing ? "Failed to update FAQ" : "Failed to create FAQ"
      );
      setCreateError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  // Handle Delete FAQ
  const handleDeleteFaq = async () => {
    if (!faqToDelete?.id) return;

    try {
      // Remove the deleted FAQ from the list
      setFaqs(faqs.filter((faq) => faq.id !== faqToDelete.id));

      // Reset delete state
      setFaqToDelete(null);

      // Call the DeleteFAQ API
      await DeleteFAQ(faqToDelete.id);
      toast.success("FAQ deleted successfully");
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      axiosErrorHandler(error, "Failed to delete FAQ");

      // Revert the deletion if the API call fails
      setFaqs((prevFaqs) => [...prevFaqs, faqToDelete]);
    }
  };

  // Open edit modal
  const openEditModal = (faq: FAQ) => {
    setCurrentFaq(faq);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  // Open create modal
  const openCreateModal = () => {
    setCurrentFaq({ question: "", answer: "", status: "active" });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  // Initial fetch
  useEffect(() => {
    fetchFaqs();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-full h-16" />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto my-10">
      {/* Header with Create FAQ Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full mx-auto border-b border-gray-200 pb-4 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          FAQs
        </h1>
        <Button
          className="flex items-center rounded-full gap-2 w-full sm:w-auto justify-center text-white"
          onClick={openCreateModal}
        >
          <Plus className="w-4 h-4" />
          Create FAQ
        </Button>
      </div>

      {/* FAQ List */}
      <div className="w-full mx-auto mt-4">
        {faqs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No FAQs available. Create your first FAQ!
          </div>
        ) : (
          <Accordion type="single" collapsible={true} className="space-y-2">
            {faqs?.map((faq) => (
              <AccordionItem
                key={faq?.id}
                value={`item-${faq?.id}`}
                className=" rounded-xl bg-[#F6F6F6]"
              >
                <AccordionTrigger className="px-4 py-6 hover:no-underline">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full pr-4 space-y-2 sm:space-y-0">
                    <span className="font-bold text-left text-tertiary text-sm sm:text-base">
                      Q: {faq?.question}
                    </span>

                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          faq?.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {faq?.status}
                      </span>

                      <button
                        className="flex items-center px-2 text-[#AFAFAF] hover:text-[#333] text-xs sm:text-sm"
                        onClick={() => openEditModal(faq)}
                      >
                        <Pencil className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="inline-block font-bold">Edit</span>
                      </button>

                      <button
                        className="flex items-center px-2 text-[#AFAFAF] hover:text-[#333] text-xs sm:text-sm"
                        onClick={() => setFaqToDelete(faq)}
                      >
                        <Trash className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="inline-block font-bold">Delete</span>
                      </button>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-white rounded-b-lg">
                  <div className="p-4">
                    <p className="mb-4 text-sm sm:text-base">A: {faq.answer}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {/* Create/Edit FAQ Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit FAQ" : "Create New FAQ"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>

              <Textarea
                id="question"
                value={currentFaq.question}
                onChange={(e) =>
                  setCurrentFaq({ ...currentFaq, question: e.target.value })
                }
                rows={3}
                placeholder="Enter the question..."
                disabled={isCreating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={currentFaq.answer}
                onChange={(e) =>
                  setCurrentFaq({ ...currentFaq, answer: e.target.value })
                }
                rows={5}
                placeholder="Enter the answer..."
                disabled={isCreating}
              />
            </div>
            {createError && (
              <div className="text-red-500 text-sm">{createError}</div>
            )}
            <div className="flex items-center space-x-2">
              <Switch
                id="status"
                checked={currentFaq.status === "active"}
                onCheckedChange={(checked) =>
                  setCurrentFaq({
                    ...currentFaq,
                    status: checked ? "active" : "inactive",
                  })
                }
                disabled={isCreating}
              />
              <Label htmlFor="status">Active</Label>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitFaq} disabled={isCreating}>
                {isCreating
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                  ? "Update FAQ"
                  : "Create FAQ"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      {faqToDelete && (
        <Dialog open={!!faqToDelete} onOpenChange={() => setFaqToDelete(null)}>
          <DialogContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-red-100 p-4 rounded-full">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">Delete FAQ</h2>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete this FAQ?
                </p>
                <p className="font-semibold mb-4">"{faqToDelete.question}"</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setFaqToDelete(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteFaq}>
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
