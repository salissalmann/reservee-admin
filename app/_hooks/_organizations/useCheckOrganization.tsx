import { useState, useEffect } from "react";
import { rootPath } from "@/app/_constants/config";
import { axiosErrorHandler } from "@/app/_utils/utility-functions";
import apiClient from "@/app/_utils/axios";
import { OrganizationData } from "@/app/_types/organization-types";

export const useOrganization = () => {
  const [loading, setLoading] = useState(false);
  const [organizationExists, setOrganizationExists] = useState(false);
  const [organizations, setOrganizations] = useState<OrganizationData[] | null>(null);

  const checkOrganization = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`${rootPath}/get-all-vendor-organizations`);
      if (response?.data?.statusCode === 200) {
          setOrganizationExists(true);
          setOrganizations(response?.data?.data);
      }
    } catch (error) {
      axiosErrorHandler(error, "Error checking if organization exists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkOrganization();
  }, []);

  return {
    loading,
    organizationExists,
    organizations,
    checkOrganization,
    setLoading,
  };
};
