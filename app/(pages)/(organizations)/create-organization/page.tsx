"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Image from "next/image";

// Dynamic imports
const ReactQuill = dynamic(() => import("react-quill"), { 
  ssr: false,
  loading: () => <div className="h-[200px] animate-pulse bg-gray-200 rounded-lg" />
});
const Navigation = dynamic(() => import("@/app/_components/_layout-components/navigation"));
const Loader = dynamic(() => import("@/app/_components/_layout-components/loader"));

// Components imports
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Building2, CheckCircle2, Handshake, ImagePlus, Upload, Type 
} from "lucide-react";

// API and utils imports
import { uploadSingleFile } from "@/app/_apis/util-apis";
import { CreateOrganizationAPI } from "@/app/_apis/organization-apis";
import { axiosErrorHandler, stripHtml } from "@/app/_utils/utility-functions";
import "react-quill/dist/quill.snow.css";
import { useGetCategories } from "@/app/_hooks/_categories/useGetCategories";
import { useOrganizationForm } from "@/app/_hooks/_categories/handleOrganizationForm";
import { validateFormData } from "@/app/_validations/organization_validations";

export default function OrganizationForm() {
  const router = useRouter();
  const { categories, loading: categoriesLoading, error: categoriesError } = useGetCategories();
  const { 
    formData, 
    setFormData, 
    dragActive,
    handleInputChange, 
    handleDescriptionChange,
    handleCategoryToggle,
    handleDrag,
    handleDrop
  } = useOrganizationForm({
    name: "",
    description: "",
    logo: null,
    logoFile: null,
    categories: [],
  }, null);

  const [loading, setLoading] = React.useState(false);
  const [createSuccess, setCreateSuccess] = React.useState(false);
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, logoFile: file }));
      } else {
        toast.error("Please upload an image file");
      }
    }
  }, [setFormData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validateFormData(formData)) {
        setLoading(false);
        return;
      }

      const logoResponse = await uploadSingleFile(formData.logoFile as File);
      if (logoResponse?.statusCode !== 200) {
        throw new Error("Error uploading logo");
      }

      const organizationResponse = await CreateOrganizationAPI({
        name: formData.name,
        description: formData.description,
        logo: logoResponse.data,
        categories: formData.categories,
      });

      if (organizationResponse?.statusCode === 201) {
        toast.success(organizationResponse?.message);
        setCreateSuccess(true);
        setTimeout(() => router.push("/select-organization"), 2000);
      }
    } catch (error) {
      axiosErrorHandler(error, "Error creating organization");
    } finally {
      setLoading(false);
    }
  };

  if (loading || categoriesLoading) return <Loader />;
  if (categoriesError) return <div>Error loading categories. Please try again.</div>;

  const SuccessView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-[calc(100vh-64px)]"
    >
      <CheckCircle2 className="w-20 h-20 text-green-500 mb-4" />
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
        Organization Created!
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        You're all set to start managing your organization.
      </p>
    </motion.div>
  );

  const LogoUploader = () => (
    <Card
      className={`relative bg-white dark:bg-tertiary flex flex-col items-center justify-center rounded-lg border-2 border-dashed 
        ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 dark:border-borderDark"} p-12 text-center`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {formData.logoFile ? (
        <div className="relative w-32 h-32">
          <Image
            src={URL.createObjectURL(formData.logoFile)}
            alt="Organization Logo"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
      ) : (
        <ImagePlus className="h-12 w-12 text-muted-foreground/50" />
      )}
      <p className="mt-4 text-sm text-muted-foreground">
        Drag and drop logo or
      </p>
      <Button
        type="button"
        className="mt-4 w-full max-w-xs bg-secondary text-white hover:bg-gray-100 hover:text-black transition-all duration-300"
        onClick={() => imageInputRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload Logo
      </Button>
      <p className="text-sm text-muted-foreground mt-4">
        Logo should be a square image of type jpeg or png and less than 10mb
      </p>
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/png"
        className="hidden"
      />
    </Card>
  );

  return (
    <>
       
      <AnimatePresence mode="wait">
        {!createSuccess ? (
          <div className="w-full md:w-[75%] mx-auto px-4 py-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative flex flex-col justify-between">
                <div className="w-full flex flex-col items-start justify-start mt-4 gap-2 mb-4">
                  <h1 className="text-xl md:text-3xl font-extrabold">
                    Let's Build Your Organization Profile
                  </h1>
                  <p className="text-sm md:text-md text-muted-foreground">
                    We'll use this information to create your organization profile.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-4">
                  <form onSubmit={handleSubmit}>
                    <Card className="w-full bg-white dark:bg-transparent text-black dark:text-white mx-auto shadow-xl border dark:border-borderDark border-gray-200">
                      <CardHeader>
                        <div className="flex items-center flex-col gap-2">
                          <Building2 className="w-8 h-8 md:w-12 md:h-12 text-secondary" />
                          <p className="text-sm md:text-md text-muted-foreground text-center">
                            Provide basic information about your organization.
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Name Input */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                          className="space-y-2"
                        >
                          <Label htmlFor="org-name" className="text-black dark:text-gray-100 font-semibold">
                            <span className="text-primary font-bold">*</span> Organization Name
                          </Label>
                          <div className="relative">
                            <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                            <Input
                              id="org-name"
                              name="name"
                              placeholder="Organization Name"
                              className="pl-10 pr-16 rounded-full"
                              value={formData.name}
                              onChange={handleInputChange}
                              maxLength={20}
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                              {formData.name.length}/20
                            </span>
                          </div>
                        </motion.div>

                        {/* Description Editor */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.6 }}
                          className="space-y-2"
                        >
                          <Label className="text-black dark:text-gray-100 font-semibold">
                            <span className="text-primary font-bold">*</span> Description
                          </Label>
                          <div className="border dark:border-borderDark rounded-lg">
                            <ReactQuill
                              theme="snow"
                              value={formData.description}
                              onChange={handleDescriptionChange}
                              modules={{
                                toolbar: [
                                  ["bold", "italic", "underline"],
                                  [{ list: "ordered" }, { list: "bullet" }],
                                  ["link"],
                                  ["clean"],
                                ],
                              }}
                            />
                          </div>
                          <p className="text-sm text-gray-500">
                            {stripHtml(formData.description).length}/500 characters
                          </p>
                        </motion.div>

                        {/* Logo Upload */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.9 }}
                          className="space-y-2"
                        >
                          <Label className="text-black dark:text-gray-100 font-semibold">
                            Organization Logo
                          </Label>
                          <LogoUploader />
                        </motion.div>

                        {/* Categories */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 1.2 }}
                          className="space-y-2"
                        >
                          <Label className="text-black dark:text-gray-100 font-semibold">
                            <span className="text-primary font-bold">*</span> Categories
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                              <Button
                                key={category.id}
                                type="button"
                                onClick={() => handleCategoryToggle(Number(category.id))}
                                className={`rounded-full ${
                                  formData.categories.includes(Number(category.id))
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {category.name}
                              </Button>
                            ))}
                          </div>
                        </motion.div>

                        <Button
                          type="submit"
                          className="w-full bg-primary text-white hover:bg-primary/90 rounded-full"
                        >
                          Create Organization
                        </Button>
                      </CardContent>
                    </Card>
                  </form>

                  {/* Side Info Card */}
                  <Card className="h-fit">
                    <CardHeader>
                      <div className="flex items-center flex-col gap-2">
                        <Handshake className="w-12 h-12 text-secondary" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-center text-sm text-gray-500">
                        You're just a step away from unlocking all the tools to manage your events and teams.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <SuccessView />
        )}
      </AnimatePresence>
    </>
  );
}