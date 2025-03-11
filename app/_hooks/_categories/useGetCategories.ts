import React from "react";
import { axiosErrorHandler } from "@/app/_utils/utility-functions";
import { ICategory } from "@/app/_types/categories-types";
import apiClient from "@/app/_utils/axios";
import { rootPath } from "@/app/_constants/config";

export const useGetCategories = () => {
    const [categories, setCategories] = React.useState<ICategory[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClient.get(`${rootPath}/get-published-categories`);
                if (response?.status === 200) {
                    setCategories(response?.data?.data);
                }
            } catch (error) {
                const errorMessage = "Error fetching categories";
                axiosErrorHandler(error, errorMessage);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return { categories, loading, error };
};