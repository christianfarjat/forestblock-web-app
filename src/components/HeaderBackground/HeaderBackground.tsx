import React from "react";
import { HeaderBackgroundProps } from "./types";

const HeaderBackground: React.FC<HeaderBackgroundProps> = ({
  coverImage,
  containerClassName,
  overlayClassName,
  children,
}) => {
  return (
    <div
      className={
        containerClassName ||
        "relative w-full h-[300px] lg:h-[400px] bg-cover bg-center rounded-t-3xl"
      }
      style={{
        backgroundImage: `url(${coverImage || "/images/placeholder.jpg"})`,
      }}
    >
      <div
        className={
          overlayClassName ||
          "absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center gap-4 p-2 sm:p-4 rounded-t-3xl"
        }
      >
        {children}
      </div>
    </div>
  );
};

export default HeaderBackground;
