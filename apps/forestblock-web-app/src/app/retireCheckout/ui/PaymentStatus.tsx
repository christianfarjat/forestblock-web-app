const PaymentStatus: React.FC<{ paymentStatus: string }> = ({
  paymentStatus,
}) => (
  <div>
    <p className="text-customGray text-[17px] font-neueMontreal">Estado: </p>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-customYellow animate-pulse"></div>
      <span className="font-medium font-neueMontreal text-[17px]">
        {paymentStatus}
      </span>
    </div>
  </div>
);

export default PaymentStatus;
