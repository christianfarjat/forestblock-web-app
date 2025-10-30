"use client";

import { Project } from "@/types/project";
import { OrderDetails, QuoteDetails } from "@/types/retirement";
import React, { createContext, useContext, useState } from "react";
import { RetireContextProps } from "./types";
import { Retirement } from "@/types/useRetirements";

const RetireContext = createContext<RetireContextProps | undefined>(undefined);

export const RetireProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tonnesToRetire, setTonnesToRetire] = useState<number>(1);
  const [beneficiary, setBeneficiary] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [project, setProject] = useState<Project | null>(null);
  const [index, setIndex] = useState<number | string>(0);
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [quoteDetails, setQuoteDetails] = useState<QuoteDetails | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [newRetirement, setNewRetirement] = useState<Retirement>();

  return (
    <RetireContext.Provider
      value={{
        tonnesToRetire,
        setTonnesToRetire,
        beneficiary,
        setBeneficiary,
        message,
        setMessage,
        project,
        setProject,
        index,
        setIndex,
        totalSupply,
        setTotalSupply,
        quoteDetails,
        setQuoteDetails,
        orderDetails,
        setOrderDetails,
        newRetirement,
        setNewRetirement,
      }}
    >
      {children}
    </RetireContext.Provider>
  );
};

export const useRetire = () => {
  const context = useContext(RetireContext);
  if (!context) {
    throw new Error("useRetire must be used within a RetireProvider");
  }
  return context;
};
