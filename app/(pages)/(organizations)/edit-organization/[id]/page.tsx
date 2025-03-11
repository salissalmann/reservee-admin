"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Image from "next/image";

// Dynamic imports
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] animate-pulse bg-gray-200 rounded-lg" />
  ),
});
const Loader = dynamic(
  () => import("@/app/_components/_layout-components/loader")
);

// Components imports
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2, ImagePlus, Upload, Type } from "lucide-react";

// API and utils imports
import { uploadSingleFile } from "@/app/_apis/util-apis";
import { UpdateOrganizationAPI } from "@/app/_apis/organization-apis";
import { axiosErrorHandler, stripHtml } from "@/app/_utils/utility-functions";
import { useGetOrganizationById } from "@/app/_hooks/_organizations/useGetOrganizationById";
import "react-quill/dist/quill.snow.css";
import { useGetCategories } from "@/app/_hooks/_categories/useGetCategories";
import { useEditOrganizationForm } from "@/app/_hooks/_categories/handleOrganizationForm";
import { validateFormData } from "@/app/_validations/organization_validations";
  ;
import { OrganizationData } from "@/app/_types/organization-types";
import { useSelector } from "react-redux";
import { selectOrganizationId } from "@/app/_utils/redux/organizationSlice";
import { useCheckRouteAccess } from "@/app/_utils/check-route-access";
import { useErrorModalStore } from "@/app/_store/error-modal-store";

export const runtime = "edge";

interface LogoUploaderProps {
  formData: OrganizationData;
  dragActive: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  imageInputRef: React.RefObject<HTMLInputElement>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Components
const LogoUploader = ({
  formData,
  dragActive,
  handleDrag,
  handleDrop,
  imageInputRef,
  handleFileSelect,
}: LogoUploaderProps) => (
  <Card
    className={`relative bg-white dark:bg-tertiary flex flex-col items-center justify-center rounded-lg border-2 border-dashed 
      ${
        dragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 dark:border-borderDark"
      } p-12 text-center`}
    onDragEnter={handleDrag}
    onDragLeave={handleDrag}
    onDragOver={handleDrag}
    onDrop={handleDrop}
  >
    {formData.logoFile ? (
      <div className="relative w-32 h-32">
        <Image
          src={URL.createObjectURL(formData.logoFile)}
          alt="New Organization Logo"
          layout="fill"
          objectFit="cover"
          className="rounded-full"
        />
      </div>
    ) : formData.logo ? (
      <div className="relative w-32 h-32">
        <Image
          src={formData.logo}
          alt="Current Organization Logo"
          layout="fill"
          objectFit="cover"
          className="rounded-full"
        />
      </div>
    ) : (
      <ImagePlus className="h-12 w-12 text-muted-foreground/50" />
    )}
    <p className="mt-4 text-sm text-muted-foreground">Drag and drop logo or</p>
    <Button
      type="button"
      className="mt-4 w-full max-w-xs bg-secondary text-white hover:bg-gray-100 hover:text-black transition-all duration-300"
      onClick={() => imageInputRef.current?.click()}
    >
      <Upload className="mr-2 h-4 w-4" />
      Upload New Logo
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

// Main component
export default function EditOrganizationForm({
  params,
}: {
  params: { id: string };
}) {
  const checkRouteAccess = useCheckRouteAccess();
  const organizationId: string = params.id;
  const router = useRouter();
  const { organization, loading: orgLoading } =
    useGetOrganizationById(organizationId);
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useGetCategories();

  const selectedOrganizationId = useSelector(selectOrganizationId);

  const {
    formData,
    setFormData,
    dragActive,
    handleInputChange,
    handleDescriptionChange,
    handleCategoryToggle,
    handleDrag,
    handleDrop,
  } = useEditOrganizationForm(
    {
      name: "",
      description: "",
      logo: null,
      logoFile: null,
      categories: [],
    },
    organization
  );

  const [loading, setLoading] = React.useState(false);
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.type.startsWith("image/")) {
          setFormData((prev) => ({ ...prev, logoFile: file }));
        } else {
          toast.error("Please upload an image file");
        }
      }
    },
    [setFormData]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validateFormData(formData, true)) {
        setLoading(false);
        return;
      }

      let logoUrl = formData.logo;
      if (formData.logoFile) {
        const logoResponse = await uploadSingleFile(formData.logoFile);
        if (!logoResponse?.data) {
          throw new Error("Error uploading logo");
        }
        logoUrl = logoResponse.data;
      }

      const updateResponse = await UpdateOrganizationAPI(params.id, {
        name: formData.name,
        description: formData.description,
        logo: logoUrl,
        categories: formData.categories,
      });

      if (updateResponse?.statusCode === 200) {
        toast.success(updateResponse?.message);
        router.push("/select-organization");
      }
    } catch (error) {
      axiosErrorHandler(error, "Error updating organization");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (organizationId?.toString() !== selectedOrganizationId?.toString()) {
      useErrorModalStore.getState().showError(
        "Access Denied",
        "You don't have permission to edit this organization.",
        {
          redirectPath: "/dashboard",
          canDismiss: false
        }
      );
    }
  }, [organizationId, selectedOrganizationId]);

  if (loading || orgLoading || categoriesLoading) return <Loader />;
  if (categoriesError)
    return <div>Error loading categories. Please try again.</div>;

  return (
    <>
       
      <div className="w-full md:w-[75%] mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative flex flex-col justify-between">
            <div className="w-full flex flex-col items-start justify-start mt-4 gap-2 mb-4">
              <h1 className="text-xl md:text-3xl font-extrabold">
                Edit Organization Profile
              </h1>
              <p className="text-sm md:text-md text-muted-foreground">
                Update your organization's information below.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <Card className="w-full bg-white dark:bg-transparent text-black dark:text-white mx-auto shadow-xl border dark:border-borderDark border-gray-200">
                <CardHeader>
                  <div className="flex items-center flex-col gap-2">
                    <Building2 className="w-8 h-8 md:w-12 md:h-12 text-secondary" />
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
                    <Label
                      htmlFor="name"
                      className="text-black dark:text-gray-100 font-semibold"
                    >
                      <span className="text-primary font-bold">*</span>{" "}
                      Organization Name
                    </Label>
                    <div className="relative">
                      <Type
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={18}
                      />
                      <Input
                        id="name"
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
                      <span className="text-primary font-bold">*</span>{" "}
                      Description
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
                    <LogoUploader
                      formData={formData}
                      dragActive={dragActive}
                      handleDrag={handleDrag}
                      handleDrop={handleDrop}
                      imageInputRef={imageInputRef}
                      handleFileSelect={handleFileSelect}
                    />
                  </motion.div>

                  {/* Categories */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1.2 }}
                    className="space-y-2"
                  >
                    <Label className="text-black dark:text-gray-100 font-semibold">
                      <span className="text-primary font-bold">*</span>{" "}
                      Categories
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          type="button"
                          onClick={() =>
                            handleCategoryToggle(Number(category.id))
                          }
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

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full rounded-full"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="w-full bg-primary text-white hover:bg-primary/90 rounded-full"
                    >
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
}
