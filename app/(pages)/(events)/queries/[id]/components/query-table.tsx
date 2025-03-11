"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Reply,
  CheckCircle2,
  HelpCircle,
  MailQuestion,
  Undo2,
} from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import type { Query } from "@/app/_types/queries-types";
import { MarkAsFAQ, UpdateQuery } from "@/app/_apis/queries-apis";
import { toast } from "react-hot-toast";

interface QueryTableProps {
  queries?: Query[];
  onQueryUpdate?: () => void;
}

const QueryTable = ({ queries = [], onQueryUpdate }: QueryTableProps) => {
  const [activeFilter, setActiveFilter] = React.useState<
    "all" | "pending" | "completed" | "rejected"
  >("all");
  const [sortOrder, setSortOrder] = React.useState<"newest" | "oldest">(
    "newest"
  );
  const [replyModalOpen, setReplyModalOpen] = React.useState(false);
  const [viewResponseModalOpen, setViewResponseModalOpen] =
    React.useState(false);
  const [selectedQuery, setSelectedQuery] = React.useState<Query | null>(null);
  const [response, setResponse] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [localQueries, setLocalQueries] = React.useState<Query[]>(queries);

  React.useEffect(() => {
    setLocalQueries(queries);
  }, [queries]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleMarkAsFAQ = async (query: Query) => {
    try {
      setLoading(true);
      await MarkAsFAQ(query.id);
      toast.success("Query marked as FAQ");
      // Update local state
      setLocalQueries((prev) =>
        prev.map((q) => (q.id === query.id ? { ...q, is_faq: true } : q))
      );
      onQueryUpdate?.();
    } catch (error) {
      toast.error("Failed to mark as FAQ");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsResolved = async (query: Query) => {
    setSelectedQuery(query);
    setResponse(query.response || "");
    setReplyModalOpen(true);
  };

  const handleSendResponse = async (markAsCompleted = false) => {
    if (!selectedQuery || !response.trim()) return;

    try {
      setLoading(true);
      await UpdateQuery(selectedQuery.id, {
        response: response.trim(),
        ...(markAsCompleted ? { status: "completed" } : {}),
      });
      toast.success(
        markAsCompleted
          ? "Query marked as resolved"
          : "Response sent successfully"
      );
      setReplyModalOpen(false);
      setResponse("");
      // Update local state
      setLocalQueries((prev) =>
        prev.map((q) =>
          q.id === selectedQuery.id
            ? {
                ...q,
                response: response.trim(),
                ...(markAsCompleted ? { status: "completed" } : {}),
              }
            : q
        )
      );
      onQueryUpdate?.();
    } catch (error) {
      toast.error("Failed to send response");
    } finally {
      setLoading(false);
    }
  };

  const filteredQueries = React.useMemo(() => {
    const result =
      activeFilter === "all"
        ? [...localQueries]
        : localQueries.filter((query) => query.status === activeFilter);

    return result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [localQueries, activeFilter, sortOrder]);

  return (
    <div className="py-6  mx-auto ">
      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="default"
            className={cn(
              "border-2 border-primary rounded-full font-bold flex-1 sm:flex-none",
              activeFilter === "all"
                ? "bg-primary hover:bg-primary/90 text-white"
                : "bg-transparent text-primary hover:bg-gray-50"
            )}
            onClick={() => setActiveFilter("all")}
          >
            All Queries
          </Button>
          <Button
            variant="outline"
            className={cn(
              "border-2 border-primary rounded-full font-bold flex-1 sm:flex-none",
              activeFilter === "pending"
                ? "bg-primary hover:bg-primary/90 text-white"
                : "bg-transparent text-primary hover:bg-gray-50"
            )}
            onClick={() => setActiveFilter("pending")}
          >
            Pending
          </Button>
          <Button
            variant="outline"
            className={cn(
              "border-2 border-primary rounded-full font-bold flex-1 sm:flex-none",
              activeFilter === "completed"
                ? "bg-primary hover:bg-primary/90 text-white font-bold"
                : "bg-transparent text-primary hover:bg-gray-50"
            )}
            onClick={() => setActiveFilter("completed")}
          >
            Completed
          </Button>
          <Button
            variant="outline"
            className={cn(
              "border-2 border-primary rounded-full font-bold flex-1 sm:flex-none",
              activeFilter === "rejected"
                ? "bg-primary hover:bg-primary/90 text-white"
                : "bg-transparent text-primary hover:bg-gray-50"
            )}
            onClick={() => setActiveFilter("rejected")}
          >
            Rejected
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <Select
            defaultValue="newest"
            value={sortOrder}
            onValueChange={(value: "newest" | "oldest") => setSortOrder(value)}
          >
            <SelectTrigger className="w-[140px] border-0 bg-gray-50 focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Responsive Table/Card View */}
      <div className="w-full">
        {filteredQueries.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
            <MailQuestion className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
              No Results Found
            </h3>
          </div>
        ) : (
          <>
            {/* Desktop Table Header - Hidden on Mobile */}
            <div className="hidden md:grid grid-cols-7 gap-4 py-3 px-4 border-b border-gray-200 bg-gray-50 text-sm font-bold text-tertiary dark:text-white text-center">
              <div className="">Query Title:</div>
              <div className="">User Name:</div>
              <div className="">User Phone:</div>
              <div className="">Event Name:</div>
              <div className="">Date Submitted:</div>
              <div className="">Status:</div>
              <div className="">Actions:</div>
            </div>

            {/* Table Body / Mobile Cards */}
            {filteredQueries.map((query) => (
              <div
                key={query?.id}
                className="md:grid md:grid-cols-7 md:gap-4 md:py-4 md:px-4 md:border-b md:border-gray-100 md:hover:bg-gray-50"
              >
                {/* Mobile Card View */}
                <div className="md:hidden bg-white rounded-lg shadow-sm p-4 mb-4">
                  <div className="space-y-3">
                    <div className="font-bold text-lg text-tertiary dark:text-white">
                      {query?.user_query}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          User Name:
                        </span>
                        <span className="text-sm font-medium">
                          {query?.user_name}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Event Name:
                        </span>
                        <span className="text-sm font-medium">
                          {query?.event_name}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Date Submitted:
                        </span>
                        <span className="text-sm italic">
                          {formatDate(query?.created_at)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium",
                            query.status === "pending"
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          )}
                        >
                          {query.status.charAt(0).toUpperCase() +
                            query.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-3 border-t">
                      {query.response ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 text-primary hover:text-primary font-bold"
                          onClick={() => {
                            setSelectedQuery(query);
                            setViewResponseModalOpen(true);
                          }}
                        >
                          View Response
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          variant="ghost"
                          className="h-8 px-3 text-primary hover:text-primary font-bold"
                          onClick={() => {
                            setSelectedQuery(query);
                            setReplyModalOpen(true);
                          }}
                          disabled={loading}
                        >
                          <Undo2 className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                          Reply
                        </Button>
                      )}
                      <div className="flex flex-col items-center gap-2">
                        {/* <Button size="sm" variant="ghost" className="h-8 px-2">
                      <HelpCircle className="h-4 w-4 mr-1" />
                      Mark as FAQ
                    </Button> */}
                        <Button
                          size="lg"
                          variant="ghost"
                          className={cn(
                            "h-8 px-2 font-bold",
                            query.status === "completed"
                              ? "text-green-500 "
                              : "text-gray-800 dark:text-gray-200 hover:text-gray-500"
                          )}
                          onClick={() => {
                            if (query.status === "completed") {
                              toast.error("Query is already resolved");
                              return;
                            }

                            handleMarkAsResolved(query);
                          }}
                          disabled={loading}
                        >
                          <CheckCircle2
                            className={`h-4 w-4 md:h-5 md:w-5 mr-1 ${
                              query.status === "completed"
                                ? "text-green-500"
                                : "text-gray-800 dark:text-gray-200"
                            }`}
                          />
                          {query.status === "completed"
                            ? "Resolved"
                            : "Mark as Resolved"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block font-bold text-tertiary dark:text-white">
                  {query?.user_query}
                </div>
                <div className="hidden md:block text-sm text-gray-600 text-center">
                  {query?.user_name}
                </div>
                <div className="hidden md:block text-sm text-gray-600 text-center font-medium">
                  {query?.user_phone}
                </div>
                <div className="hidden md:block text-sm text-gray-600 text-center font-medium">
                  {query?.event_name}
                </div>
                <div className="hidden md:block text-sm text-gray-500 italic text-center">
                  {formatDate(query?.created_at)}
                </div>
                <div className="hidden md:flex justify-center items-center h-fit">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium",
                      query.status === "pending"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    )}
                  >
                    {query.status.charAt(0).toUpperCase() +
                      query.status.slice(1)}
                  </span>
                </div>
                <div className="hidden md:flex flex-col items-start gap-2">
                  {query.response ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-primary hover:text-primary font-bold"
                      onClick={() => {
                        setSelectedQuery(query);
                        setViewResponseModalOpen(true);
                      }}
                    >
                      View Response
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      variant="ghost"
                      className="h-8 px-3 text-primary hover:text-primary font-bold"
                      onClick={() => {
                        setSelectedQuery(query);
                        setReplyModalOpen(true);
                      }}
                      disabled={loading}
                    >
                      <Undo2 className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                      Reply
                    </Button>
                  )}
                  <div className="flex flex-col items-center gap-2">
                    {/* <Button size="sm" variant="ghost" className="h-8 px-2">
                      <HelpCircle className="h-4 w-4 mr-1" />
                      Mark as FAQ
                    </Button> */}
                    <Button
                      size="lg"
                      variant="ghost"
                      className={cn(
                        "h-8 px-2 font-bold",
                        query.status === "completed"
                          ? "text-green-500 "
                          : "text-gray-800 dark:text-gray-200 hover:text-gray-500"
                      )}
                      onClick={() => {
                        if (query.status !== "completed") {
                          toast.error("Query is already resolved");
                          return;
                        }

                        query.status !== "completed" &&
                          handleMarkAsResolved(query);
                      }}
                      disabled={loading}
                    >
                      <CheckCircle2
                        className={`h-4 w-4 md:h-5 md:w-5 mr-1 ${
                          query.status === "completed"
                            ? "text-green-500"
                            : "text-gray-800 dark:text-gray-200"
                        }`}
                      />
                      {query.status === "completed"
                        ? "Resolved"
                        : "Mark as Resolved"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Reply Modal */}
      <Dialog open={replyModalOpen} onOpenChange={setReplyModalOpen}>
        <DialogContent className="sm:max-w-[600px] p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl">
              {selectedQuery?.response
                ? "View/Resolve Query"
                : "Reply to Query"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">
                Query
              </label>
              <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 whitespace-pre-wrap">
                {selectedQuery?.user_query}
              </div>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="response"
                className="text-sm font-semibold text-gray-700"
              >
                {selectedQuery?.response
                  ? "Existing Response"
                  : "Your Response"}
              </label>
              <Textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response here..."
                className={`min-h-[120px] resize-none transition-colors ${
                  selectedQuery?.response ? "bg-gray-50" : ""
                }`}
                disabled={!!selectedQuery?.response}
              />
            </div>
          </div>
          <DialogFooter className="mt-6 gap-3">
            <Button
              variant="outline"
              onClick={() => setReplyModalOpen(false)}
              disabled={loading}
              className="min-w-[100px]"
            >
              Close
            </Button>
            {selectedQuery?.status !== "completed" && (
              <Button
                onClick={() => {
                  if (!response.trim() && !selectedQuery?.response) {
                    toast.error("Please enter a response");
                    return;
                  }
                  handleSendResponse(true);
                }}
                disabled={loading}
                className="min-w-[140px] text-white"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Processing...
                  </span>
                ) : (
                  "Mark as Resolved"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Response Modal */}
      <Dialog
        open={viewResponseModalOpen}
        onOpenChange={setViewResponseModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Query Response</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div className="text-sm font-medium">Query</div>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {selectedQuery?.user_query}
              </div>
              <div className="text-sm font-medium mt-4">Response</div>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {selectedQuery?.response}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setViewResponseModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QueryTable;
