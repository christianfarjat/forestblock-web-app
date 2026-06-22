import Image from "next/image";
import { getOdsImage } from "@/utils/odsUtils";
import Link from "next/link";
import { SDG_TITLES } from "@/constants";

const SustainableGoals = ({ goals }: { goals: string[] }) => (
  <div className="mx-auto max-w-5xl flex flex-col gap-5">
    <div className="grid grid-cols-[repeat(auto-fill,_60px)] sm:grid-cols-[repeat(auto-fill,_80px)] gap-4 justify-start">
      {goals.map((goal) => {
        try {
          const goalNumber = parseInt(goal);
          if (isNaN(goalNumber)) {
            throw new Error(`Invalid goal number: ${goal}`);
          }

          const sdg = SDG_TITLES[goalNumber - 1];
          if (!sdg) {
            throw new Error(`No SDG found for ${goalNumber}`);
          }

          const imagePath = getOdsImage(sdg.id);
          const tooltipText = sdg.name || `ODS ${goalNumber}`;

          return (
            <div key={goal} className="group relative flex items-center">
              <Image
                src={imagePath}
                alt={tooltipText}
                width={80}
                height={80}
                className="rounded-lg w-[60px] sm:w-[80px] h-[60px] sm:h-[80px]"
                priority
              />
              <div
                className="
                  absolute
                  bottom-full
                  left-1/2
                  -translate-x-1/2
                  mb-2
                  px-2
                  py-1
                  bg-forestGreen
                  text-white
                  text-xs
                  rounded
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                  pointer-events-none

                  /* En mobile: limitar ancho y permitir varias líneas */
                  max-w-[90vw]
                  whitespace-normal
                  break-words

                  /* A partir de sm: restaurar comportamiento anterior */
                  sm:max-w-none
                  sm:whitespace-nowrap
                "
              >
                {tooltipText}
                <div
                  className="
                    absolute
                    bottom-[-4px]
                    left-1/2
                    -translate-x-1/2
                    w-0
                    h-0
                    border-x-4
                    border-t-4
                    border-x-transparent
                    border-t-forestGreen
                  "
                />
              </div>
            </div>
          );
        } catch (error) {
          console.error(error);
          return (
            <div key={goal} className="text-red-500">
              Imagen no encontrada para el ODS {goal}
            </div>
          );
        }
      })}
    </div>
    <Link
      target="_blank"
      href="https://www.undp.org/es/sustainable-development-goals"
      className="text-customBlue underline text-[16px] sm:text-[18px] font-neueMontreal"
    >
      Aprende más sobre los ODS de la ONU
    </Link>
  </div>
);

export default SustainableGoals;
