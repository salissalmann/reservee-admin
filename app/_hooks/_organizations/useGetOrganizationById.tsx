import { useState, useEffect } from "react";
import { axiosErrorHandler } from "@/app/_utils/utility-functions";
import { GetOrganizationById } from "../../_apis/organization-apis";
import { OrganizationData } from "@/app/_types/organization-types";

export const useGetOrganizationById = (id: string | number) => {
  const [loading, setLoading] = useState(false);
  const [organization, setOrganization] = useState<OrganizationData | null>(
    null
  );
  const getOrganizationById = async (id: string | number) => {
    const stringId = String(id);
    if (!stringId || stringId.trim().length === 0) return;

    setLoading(true);
    try {
      const response = await GetOrganizationById(id);
      if (response?.statusCode === 200 && response?.data) {
        setOrganization(response?.data);
      }
    } catch (error) {
      axiosErrorHandler(error, "Error fetching organization");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getOrganizationById(id);
    }
  }, [id]);

  return {
    loading,
    organization,
    getOrganizationById,
    setLoading,
  };
};
