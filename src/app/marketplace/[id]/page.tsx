"use client";

import { useParams, useSearchParams } from "next/navigation";
import ProjectInfo from "@/components/ProjectInfo/ProjectInfo";
import useMarketplace from "@/hooks/useMarketplace";
import LoaderScreenDynamic from "@/components/LoaderScreen/LoaderScreenDynamic";

export default function ProjectDetail() {
  const searchParams = useSearchParams();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const priceParam = searchParams.get("price");

  const { project, handleRetire, prices, isPricesLoading } = useMarketplace(id);

  if (!project) {
    return <LoaderScreenDynamic />;
  }

  const matches =
    prices?.filter((price) =>
      price?.listing
        ? price.listing?.creditId?.projectId === project.key
        : price?.carbonPool?.creditId.projectId === project.key
    ) || [];

  const selectedPriceObj = priceParam
    ? matches.find(
        (priceObj) => priceObj.purchasePrice.toString() === priceParam
      )
    : null;

  const displayPrice = selectedPriceObj
    ? selectedPriceObj.purchasePrice.toFixed(2)
    : project.displayPrice;
  const selectedVintage = selectedPriceObj
    ? selectedPriceObj.listing?.creditId?.vintage?.toString() ||
      selectedPriceObj.carbonPool?.creditId?.vintage?.toString()
    : project.selectedVintage;

  return (
    <div className="flex gap-10 p-5 overflow-hidden md:overflow-visible min-h-screen">
      <ProjectInfo
        project={project}
        handleRetire={handleRetire}
        matches={matches}
        selectedVintage={selectedVintage}
        displayPrice={displayPrice}
        priceParam={priceParam}
        isPricesLoading={isPricesLoading}
      />
    </div>
  );
}
