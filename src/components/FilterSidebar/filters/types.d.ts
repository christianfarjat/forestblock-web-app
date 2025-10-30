import { UNSDG } from "../types";

export type UNSDGFilterProps = {
  unsdgList: UNSDG[];
  selectedUNSDG: string[];
  toggleUNSDG: (id: string) => void;
};
