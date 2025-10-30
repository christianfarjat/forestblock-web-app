import React from "react";

const ListingItemSkeleton = () => {
  return (
    <div className="relative pb-6 mb-8 last:mb-0 flex flex-col gap-5 h-auto animate-pulse">
      {/* Año */}
      <div className="flex flex-col gap-1">
        <div className="h-4 bg-gray-200 w-1/4 rounded"></div>{" "}
        {/* Label "Año" */}
        <div className="h-10 bg-gray-200 w-full rounded"></div>{" "}
        {/* Simula el select */}
      </div>
      <div className="w-full h-[1px] bg-gray-200"></div>

      {/* Precio */}
      <div className="flex flex-col gap-1">
        <div className="h-4 bg-gray-200 w-1/4 rounded"></div>{" "}
        {/* Label "Precio" */}
        <div className="h-6 bg-gray-200 w-1/3 rounded"></div>{" "}
        {/* Precio placeholder */}
      </div>
      <div className="w-full h-[1px] bg-gray-200"></div>

      {/* Antigüedad */}
      <div className="flex flex-col gap-1">
        <div className="h-4 bg-gray-200 w-1/4 rounded"></div>{" "}
        {/* Label "Antigüedad" */}
        <div className="h-6 bg-gray-200 w-1/4 rounded"></div>{" "}
        {/* Valor placeholder */}
      </div>
      <div className="w-full h-[1px] bg-gray-200"></div>

      {/* Cantidad */}
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 w-1/4 rounded"></div>{" "}
        {/* Label "Cantidad" */}
        <div className="flex flex-col items-end">
          <div className="h-10 bg-gray-200 w-24 rounded"></div>{" "}
          {/* Simula el QuantitySelector */}
          <div className="h-4 bg-gray-200 w-16 mt-1 rounded"></div>{" "}
          {/* Unidad placeholder */}
        </div>
      </div>
      <div className="w-full h-[1px] bg-gray-200"></div>

      {/* Available tonnes */}
      <div className="flex flex-col gap-1">
        <div className="h-4 bg-gray-200 w-1/4 rounded"></div>{" "}
        {/* Label "Available tonnes" */}
        <div className="h-6 bg-gray-200 w-1/3 rounded"></div>{" "}
        {/* Valor placeholder */}
      </div>
      <div className="w-full h-[1px] bg-gray-200"></div>

      {/* Asset */}
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 w-1/4 rounded"></div>{" "}
        {/* Label "Asset" */}
        <div className="h-4 bg-gray-200 w-1/3 rounded"></div>{" "}
        {/* Simula el Link del asset */}
      </div>
      <div className="w-full h-[1px] bg-gray-200"></div>

      {/* Total */}
      <div className="flex justify-between items-center text-[23px]">
        <div className="h-4 bg-gray-200 w-1/4 rounded"></div>{" "}
        {/* Label "Total" */}
        <div className="h-4 bg-gray-200 w-1/4 rounded"></div>{" "}
        {/* Valor total placeholder */}
      </div>

      {/* Botón "Retirar" */}
      <button className="mt-2 w-full px-4 py-8 bg-mintGreen text-forestGreen font-medium font-aeonik rounded-full shadow text-[23px]"></button>
    </div>
  );
};

export default ListingItemSkeleton;
