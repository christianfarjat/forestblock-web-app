import React from "react";

import SelectableItem from "./SelectableItem";
import DepositDetails from "./DepositDetails";
import { DepositAddressProps } from "../types";

const DepositAddress: React.FC<DepositAddressProps> = ({
  paymentDetails,
  currency,
  network,
}) => {
  return (
    <div className="bg-white rounded-xl space-y-6 p-6">
      <SelectableItem
        title="Seleccionar moneda"
        logoSrc={currency.logoSrc}
        label={currency.name}
        description={currency.fullName}
      />

      <SelectableItem
        title="Seleccionar red"
        logoSrc={network.logoSrc}
        label={network.name}
        description={network.fullName}
      />

      <DepositDetails
        address={paymentDetails.paymentData.address}
        qrPayload={paymentDetails.qrPayload}
      />
    </div>
  );
};

export default DepositAddress;
