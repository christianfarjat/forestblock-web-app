"use client";

import React, { FC } from "react";
import HeroBanner from "@/components/HeroBanner/HeroBanner";
import { loom_video } from "@/constants";
import { useRouter } from "next/navigation";
import { HeaderSectionProps } from "./types";
import Button from "./Button";
// import { useAuth } from "@/context/AuthContext";
// import { useModal } from "@/context/ModalContext";

const HeaderSection: FC<HeaderSectionProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  const router = useRouter();
  // const { isAuthenticated, setRedirectUrl } = useAuth();
  // const { openModal } = useModal();

  const handleCalculatorClick = () => {
    router.push("/calculate");
  };

  return (
    <HeroBanner
      title={
        <h1 className="text-[23px] md:text-[40px] font-bold font-aeonik leading-tight">
          Reduce tu impacto con nuestro <br />
          <span className="text-mintGreen font-aeonik">
            mercado de carbono
          </span>{" "}
          sostenible
        </h1>
      }
      showSearchbar
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    >
      <Button
        variant="primary"
        onClick={() => window.open(loom_video, "_blank")}
      >
        ¿Cómo funciona?
      </Button>
      <Button variant="secondary" onClick={handleCalculatorClick}>
        Calculadora de huella
      </Button>
    </HeroBanner>
  );
};

export default HeaderSection;
