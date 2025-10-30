import { OrderDetails } from "@/types/retirement";
import { useRouter } from "next/navigation";
import Divider from "@/components/Divider/Divider";
import Button from "@/components/Button/Button";

import Link from "next/link";
import renderDetail from "./renderDetail";
import renderStatus from "./renderStatus";
import { formatNumber } from "@/utils/formatNumber";
import useRetirements from "@/hooks/useRetirements";
import { useRetire } from "@/context/RetireContext";

const CompletedDetails: React.FC<{
  details: OrderDetails | null;
}> = ({ details }) => {
  const { setProject, setOrderDetails, newRetirement } = useRetire();
  const { retirements } = useRetirements();
  const router = useRouter();

  if (!details) return null;

  const { order, status, quote: externalQuote } = details;
  const { beneficiary_name, retirement_message, polygonscan_url } = order;

  const value = externalQuote?.cost_usdc?.toFixed(2) || 0;

  const navigateToDetail = () => {
    if (retirements) {
      router.push(`/retirements/${newRetirement?._id}`);
      setOrderDetails(null);
      setProject(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 md:gap-10">
      <div
        className={`p-5 md:p-10 pb-10 md:pb-20 rounded-2xl bg-white ${"max-w-5xl"} w-full flex flex-col gap-6 ${"md:gap-10"}`}
      >
        <>
          <h1 className="text-2xl md:text-[40px] text-forestGreen font-aeonik font-bold">
            ¡Pago exitoso!
          </h1>
          <Divider customClassName="w-[100%]" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderDetail({
              label: "ID de orden",
              value: order?.quote?.uuid || "No disponible",
              isStrong: true,
            })}
            {renderDetail({
              label: "Estado",
              value: renderStatus({
                status: status || "No disponible",
              }),
              isStrong: true,
            })}
          </div>
          <Divider customClassName="w-[100%]" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {renderDetail({
              label: "Beneficiario",
              value: beneficiary_name || "No disponible",
              isStrong: true,
            })}
            {renderDetail({
              label: "Mensaje",
              value: retirement_message || "No disponible",
              isStrong: true,
            })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {renderDetail({
              label: "Costo Total",
              value: externalQuote?.cost_usdc
                ? `${formatNumber(Number(value))} USDT`
                : "No disponible",
              isStrong: true,
            })}
            {renderDetail({
              label: "Transacción",
              value: polygonscan_url ? (
                <Link
                  href={polygonscan_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Ver en Polygonscan
                </Link>
              ) : (
                "No disponible"
              ),
              isStrong: true,
            })}
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-10">
            <Button
              text="Retirar más"
              onClick={() => router.push("/marketplace")}
              variant="primary"
            />
            <Button
              text="Ver certificado"
              onClick={() => navigateToDetail()}
              variant="secondary"
              disabled={status === "PENDING"}
            />
          </div>
        </>
      </div>
    </div>
  );
};

export default CompletedDetails;
