"use client";

import { useEffect, useState } from "react";
import { GetQueriesByEventId } from "@/app/_apis/queries-apis";
import { Query } from "@/app/_types/queries-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MailQuestion, Plus, Search } from "lucide-react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamic import for QueryTable with loading state
const QueryTable = dynamic(() => import("./query-table"), {
  ssr: false,
  loading: () => (
    <div className="space-y-4 p-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="w-full h-16" />
      ))}
    </div>
  ),
});

interface QueriesSectionProps {
  event_id: string;
}

const QueriesSection = ({ event_id }: QueriesSectionProps) => {
  // State management
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [queries, setQueries] = useState<Query[]>([]);
  const [filteredQueries, setFilteredQueries] = useState<Query[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch queries for the specific event
  const fetchQueries = async () => {
    if (!event_id) {
      setError("Event ID is required");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await GetQueriesByEventId(event_id);

      if (response?.status === true && Array.isArray(response?.data)) {
        setQueries(response.data);
        setFilteredQueries(response.data);
      } else {
        setError("Failed to fetch queries. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Error fetching queries:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchQueries();
  }, [event_id]);

  // Filter queries based on search
  useEffect(() => {
    if (!queries?.length) {
      setFilteredQueries([]);
      return;
    }

    const filtered = queries.filter((query) =>
      query?.user_query
        ?.toLowerCase?.()
        ?.includes(searchQuery?.toLowerCase?.() || "")
    );
    setFilteredQueries(filtered);
  }, [searchQuery, queries]);

  return (
    <div>
      {/* Header */}
      <header>
        <div className="flex flex-wrap items-center justify-between  mx-auto border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2 md:mb-0">
            <MailQuestion className="h-8 w-8" /> Queries
          </h1>

          <div className="flex md:flex-row flex-col items-center gap-4 w-full md:w-96">
            <div className="flex flex-col sm:flex-row gap-4 dark:bg-tertiary w-full">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-1 top-1 h-7 w-7 p-2 text-white bg-primary rounded-full" />
                <Input
                  placeholder="Search by user name, query title, or event name"
                  className="p-4 pl-10 rounded-full w-full dark:border dark:border-borderDark border-0 bg-gray-100 dark:bg-tertiary focus:border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                  value={searchQuery || ""}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className=" mx-auto mt-6">
        {error ? (
          <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={fetchQueries}
              disabled={isLoading}
            >
              Try Again
            </Button>
          </div>
        ) : !isLoading && !queries?.length ? (
          <div className="text-center p-8 bg-gray-50 dark:bg-gray-900/20 rounded-lg w-[95%] mx-auto">
            <MailQuestion className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
              No Queries Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1 mb-4">
              There are no queries for this event yet.
            </p>
            <Button
              onClick={fetchQueries}
              className="bg-primary text-white hover:bg-primary rounded-full hover:scale-105 transition-all duration-300"
            >
              Refresh
            </Button>
          </div>
        ) : (
          <QueryTable queries={filteredQueries} onQueryUpdate={fetchQueries} />
        )}
      </div>
    </div>
  );
};

export default QueriesSection;
