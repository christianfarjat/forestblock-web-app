import Link from "next/link";

const RegistryInfo = ({ url }: { url: string }) => (
  <div className="bg-white shadow-lg rounded-lg md:rounded-xl px-6 py-10">
    <h2 className="text-[23px] font-medium mb-4 text-forestGreen font-aeonik">
      Registry
    </h2>
    <p className="text-[18px] text-customGray font-aeonik">
      International Carbon Registry
    </p>
    <Link
      href={url}
      target="_blank"
      rel="noreferrer"
      className="text-customBlue underline text-[20px]"
    >
      Registry details
    </Link>
  </div>
);

export default RegistryInfo;
