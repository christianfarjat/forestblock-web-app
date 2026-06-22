"use client";

import Divider from "@/components/Divider/Divider";
import React, { useState, useEffect } from "react";
import ProjectInfo from "./ProjectInfo";
import PaymentCheckoutDetails from "./PaymentDetails";
import { PaymentDetailsSectionProps } from "../types";
import Timer from "./Timer";

const PaymentDetailsSection: React.FC<PaymentDetailsSectionProps> = ({
  listing,
  paymentDetails,
  paymentStatus,
  amountReceived,
  methodologyName,
  project,
  index,
}) => {
  const initialTime = 10 * 60; // 10 minutos en segundos
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    let startTime = localStorage.getItem("paymentStartTime");
    if (!startTime) {
      startTime = String(Date.now());
      localStorage.setItem("paymentStartTime", startTime);
    }
    const parsedStartTime = parseInt(startTime, 10);

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - parsedStartTime) / 1000);
      const remaining = Math.max(initialTime - elapsed, 0);
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [initialTime]);

  return (
    <div className="p-3 md:p-5 flex flex-col gap-5">
      <h1 className="text-xl md:text-[40px] font-bold font-aeonik text-forestGreen w-full md:w-[75%]">
        {project?.name}
      </h1>
      <Divider customClassName="w-full" />
      <ProjectInfo
        listing={listing}
        methodologyName={methodologyName}
        project={project}
        index={index}
      />
      <Divider customClassName="w-full" />
      <Timer
        minutes={Math.floor(timeLeft / 60)}
        seconds={timeLeft % 60}
        amount={paymentDetails?.paymentData?.amount}
      />
      <PaymentCheckoutDetails
        paymentDetails={paymentDetails}
        paymentStatus={paymentStatus}
        amountReceived={amountReceived}
      />
    </div>
  );
};

export default PaymentDetailsSection;
