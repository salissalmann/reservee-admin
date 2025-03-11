"use client";

import { useState, useEffect, useRef } from "react";
import { Hash, PencilLine, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { EventState } from "@/app/_types/event-types";
import { motion } from "framer-motion";
import { ICategory } from "@/app/_types/categories-types";

interface DescriptionFormProps {
  data: EventState["description"];
  onUpdate: (data: Partial<EventState["description"]>) => void;
  categories: [] | ICategory[];
}

export default function DescriptionForm({
  data,
  onUpdate,
  categories,
}: DescriptionFormProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddCategory = (category: ICategory) => {
    if (!data?.tags?.includes(category?.id as string)) {
      onUpdate({ tags: [...data?.tags, category?.id as string] });
    }
    setSelectedCategory("");
    setShowDropdown(false);
  };

  const removeCategory = (categoryId: string) => {
    onUpdate({ tags: data?.tags.filter((tag) => tag !== categoryId) });
  };

  const filteredCategories = categories?.filter(
    (category) =>
      category?.name
        ?.toLowerCase()
        ?.includes(selectedCategory?.toLowerCase()) &&
      !data?.tags?.includes(category?.id as string)
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full p-6 space-y-8 bg-white dark:bg-transparent text-black mx-auto shadow-xl border dark:border-borderDark rounded-lg">
        <h1 className="text-4xl font-bold dark:text-white">Description</h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="summary" className="dark:text-white">
              Summary <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-3 hidden md:block">
                <PencilLine className="h-5 w-5 text-gray-400" />
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Textarea
                  id="summary"
                  value={data?.summary}
                  onChange={(e) => onUpdate({ summary: e.target.value })}
                  className="min-h-[200px] md:pl-10 resize-none dark:text-gray-100 dark:bg-transparent border dark:border-borderDark border-gray-200 rounded"
                  placeholder="Summary"
                  maxLength={2000}
                />
              </motion.div>
              <span className="absolute right-3 bottom-1 text-sm text-gray-400">
                {data?.summary?.length} / 2000
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-100">
              Grab people&apos;s attention with a short description about your
              event. Attendees will see this at the top of your event page. e.g.
              Join us for the biggest summer festival of 2024!
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="dark:text-white">
              Add Tags
            </Label>

            {/* All Categories Section */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Available Categories:
              </p>
              <div className="flex flex-wrap gap-2">
                {categories
                  ?.filter((cat) => !data?.tags?.includes(cat?.id as string))
                  ?.map((category) => (
                    <Badge
                      key={category.id}
                      className="px-3 py-1 bg-primary text-white  cursor-pointer hover:bg-primary/80"
                      onClick={() => handleAddCategory(category)}
                    >
                      {category.name}
                    </Badge>
                  ))}
              </div>
            </div>

            {/* Search Categories Section */}

            <div className="flex flex-wrap gap-2 pt-2">
              {data?.tags?.map((tagId) => {
                const category = categories?.find((cat) => cat?.id === tagId);
                return category ? (
                  <Badge
                    key={tagId}
                    variant="secondary"
                    className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-transparent dark:border dark:border-borderDark"
                  >
                    {category.name}
                    <button
                      onClick={() => removeCategory(tagId)}
                      className="ml-1 hover:bg-red-200 rounded-full p-1"
                      aria-label={`Remove ${category.name} tag`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
