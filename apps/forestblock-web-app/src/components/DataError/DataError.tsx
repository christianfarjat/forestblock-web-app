import React from "react";

interface DataErrorProps {
  message: string;
}

const DataError: React.FC<DataErrorProps> = ({ message }) => (
  <div className="p-10 text-red-500 text-center">{message}</div>
);

export default DataError;
