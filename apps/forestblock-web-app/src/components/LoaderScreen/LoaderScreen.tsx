"use client";

import Image from "next/image";

const LoaderScreen = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full z-50 absolute top-0 left-0 bg-backgroundGray">
      <div className="w-50 h-50 animate-ping">
        <Image
          src="/images/logo_oscuro.svg"
          alt="loading"
          width={50}
          height={50}
          priority
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
};

export default LoaderScreen;
