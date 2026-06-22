import Image from "next/image";

interface LogoProps {
  variant?: "default" | "mobile";
}

const Logo: React.FC<LogoProps> = ({ variant = "default" }) => {
  if (variant === "mobile") {
    return (
      <div className="w-10 h-10 flex gap-2 items-center py-5">
        <Image
          src="/images/logo_claro.svg"
          alt="Logo ícono"
          width={30}
          height={30}
          style={{ objectFit: "contain" }}
          className="transition-all ease-in-out duration-300"
        />
        <h1 className="font-medium text-xl font-aeonik">
          FORESTBLOCK
        </h1>
      </div>
    );
  }

  // Versión por defecto (desktop)
  return (
    <div className="relative w-12 h-12 flex justify-center items-center my-8">
      <Image
        src="/images/logo_claro.svg"
        alt="Logo ícono"
        fill
        style={{ objectFit: "contain" }}
        className="transition-all ease-in-out duration-300"
      />
      <h1 className="relative top-11 font-medium text-xl font-aeonik">
        FORESTBLOCK
      </h1>
    </div>
  );
};

export default Logo;
