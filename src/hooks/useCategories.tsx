import { useState, useEffect } from "react";
import apiClient from "../apiClient";
import { Category } from "../models/Category";

const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // get categories
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get<Category[]>("/category_masters");
        console.log('category:',response.data);
        setCategories(response.data);
        console.log('category2:',categories);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

export default useCategories;