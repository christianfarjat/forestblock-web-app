"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import useRetirements from "@/hooks/useRetirements";
import LeftDetails from "@/app/retirementSteps/ui/LeftDetails";
import RightDetails from "@/app/retirementSteps/ui/RightDetails";
import useRetirementSteps from "@/hooks/useRetirementSteps";
import LoaderScreenDynamic from "@/components/LoaderScreen/LoaderScreenDynamic";
import TopBar from "@/components/TopBar/TopBar";

const RetirementDetailPage = () => {
  const { id } = useParams();
  const { fetchRetirementDetail, retirement, loading, error, retirementId } =
    useRetirements();

  const { downloadCertificatePDF } = useRetirementSteps();

  useEffect(() => {
    if (!id) return;
    if (typeof id === "string") {
      fetchRetirementDetail(id);
    }
  }, [id, fetchRetirementDetail]);

  if (loading) return <LoaderScreenDynamic />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!retirement && !loading)
    return <p>No se encontraron detalles para este retiro.</p>;

  const beneficiary_name = retirement?.order?.beneficiary_name || "Sin nombre";
  const retirement_message =
    retirement?.order?.retirement_message || "Sin mensaje";
  const externalQuote = retirement?.order?.quote;
  const order = retirement?.order;
  const project = retirement?.project ?? null;

  return (
    <div className="min-h-screen p-3 pb-10 md:pb-20">
      <TopBar />
      <div className="flex flex-col md:flex-row gap-10 bg-backgroundGray p-5 md:p-10 rounded-2xl">
        <div className="w-full md:w-3/5 bg-white p-5 rounded-2xl">
          <LeftDetails
            project={project}
            beneficiary_name={beneficiary_name}
            retirement_message={retirement_message}
            externalQuote={externalQuote}
            order={order}
            downloadCertificatePDF={downloadCertificatePDF}
            retirementId={retirementId}
          />
        </div>
        <div className="w-full md:w-2/5">
          <RightDetails project={project} />
        </div>
      </div>
    </div>
  );
};

export default RetirementDetailPage;
