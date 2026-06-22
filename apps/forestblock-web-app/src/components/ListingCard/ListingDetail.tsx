import { ListingDetailProps } from "./types";

const ListingDetail = ({ label, value }: ListingDetailProps) => {
  return (
    <div className="flex justify-between items-center text-customGray text-[23px] font-aeonik">
      <p>{label}</p>
      <p>{value}</p>
    </div>
  );
};

export default ListingDetail;
