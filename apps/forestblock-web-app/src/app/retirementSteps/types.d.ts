import { Project } from "@/types/project";
import { QuoteDetails } from "@/types/retirement";
import { PDFParams } from "@/types/useRetirements";

export type LeftDetailsProps = {
  project: Project | null;
  beneficiary_name: string;
  retirement_message: string;
  externalQuote: QuoteDetails | undefined;
  order: any; //eslint-disable-line
  downloadCertificatePDF: (paramsData: PDFParams) => Promise<string | any>; //eslint-disable-line
  retirementId: string | null;
};
