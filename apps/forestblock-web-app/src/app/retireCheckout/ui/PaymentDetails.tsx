import Divider from "@/components/Divider/Divider";
import { PaymentDetails } from "@/types/retirement";
import { PaymentCheckoutDetailsProps } from "../types";
import MonitoringStatus from "./MonitoringStatus";
import DepositAddress from "./DepositAddress";

const PaymentCheckoutDetails: React.FC<PaymentCheckoutDetailsProps> = ({
  paymentDetails,
}: {
  paymentDetails: PaymentDetails | null;
  paymentStatus: string;
  amountReceived: number;
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="md:text-[23px] text-[xl] font-medium font-aeonik">
          Detalle del pago
        </h3>
        <MonitoringStatus />
      </div>
      <Divider customClassName="w-[100%]" />
      <DepositAddress
        paymentDetails={paymentDetails as PaymentDetails}
        currency={{
          logoSrc: "/images/usdt.png",
          name: "USDT",
          fullName: "TetherUS",
        }}
        network={{
          logoSrc: "/images/matic-logo.webp",
          name: "MATIC",
          fullName: "Poylgon POS",
        }}
      />
    </div>
  );
};

export default PaymentCheckoutDetails;
