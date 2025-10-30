const renderStatus = ({ status }: { status: string }) => (
  <div className="flex items-center gap-2">
    {status}
    {status === "PENDING" && (
      <div className="w-4 h-4 border-2 border-gray-300 border-t-forestGreen rounded-full animate-spin"></div>
    )}
  </div>
);

export default renderStatus;
