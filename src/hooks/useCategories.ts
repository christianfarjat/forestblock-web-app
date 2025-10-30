import { useState, useEffect } from "react";
import axios from "axios";

export interface Category {
  id: string;
  name: string;
  description?: string;
  code?: string;
  color?: string;
  translations?: {
    [lang: string]: {
      name: string;
      description?: string;
    };
  };
  level?: string;
  classification?: string;
}

const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/manglai/categories`
        );
        setCategories(response.data);
      } catch (err: unknown) {
        console.error("Error fetching categories:", err);
        setError("Error fetching categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, error, isLoading };
};

export default useCategories;
