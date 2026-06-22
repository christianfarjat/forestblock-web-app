import { Employee } from "@/types/employee";
import axiosInstance from "@/utils/axios/axiosInstance";
import { useEffect, useState } from "react";

const useEmployees = (companyId: string) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!companyId) return;
    setIsLoading(true);
    axiosInstance
      .get(`/manglai/employees/${companyId}`)
      .then((response) => {
        setEmployees(response.data?.data);
      })
      .catch((err) => {
        setError(err.message || "Error fetching employees");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [companyId]);

  return { employees, error, isLoading };
};

export default useEmployees;
