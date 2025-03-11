import React from "react";
import { OrganizationData } from "@/app/_types/organization-types";
import { toast } from "react-hot-toast";

export const useOrganizationForm = (initialState: OrganizationData, organization: any) => {
  const [formData, setFormData] = React.useState<OrganizationData>(initialState);
  const [dragActive, setDragActive] = React.useState(false);

  React.useEffect(() => {
    if (organization) {
      setFormData({
        ...initialState,
        ...organization
      });
    }
  }, [organization]);

  const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleDescriptionChange = React.useCallback((content: string) => {
    setFormData(prev => ({ ...prev, description: content }));
  }, []);

  const handleCategoryToggle = React.useCallback((categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  }, []);

  const handleDrag = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, logoFile: file }));
      } else {
        toast.error("Please upload an image file");
      }
    }
  }, []);

  return {
    formData,
    setFormData,
    dragActive,
    handleInputChange,
    handleDescriptionChange,
    handleCategoryToggle,
    handleDrag,
    handleDrop,
  };
};


export const useEditOrganizationForm = (initialState: OrganizationData, organization: any) => {
  const [formData, setFormData] = React.useState<OrganizationData>(initialState);
  const [dragActive, setDragActive] = React.useState(false);

  React.useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || "",
        description: organization.description || "",
        logo: organization.logo || null,
        newLogoFile: null,
        categories: organization.categories || []
      });
    }
  }, [organization]);

  const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleDescriptionChange = React.useCallback((content: string) => {
    setFormData(prev => ({ ...prev, description: content }));
  }, []);

  const handleCategoryToggle = React.useCallback((categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  }, []);

  const handleDrag = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, newLogoFile: file }));
      } else {
        toast.error("Please upload an image file");
      }
    }
  }, []);

  return {
    formData,
    setFormData,
    dragActive,
    handleInputChange,
    handleDescriptionChange,
    handleCategoryToggle,
    handleDrag,
    handleDrop,
  };
};
