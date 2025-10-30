import { Image as ProjectImage } from "@/types/project";
import { Location } from "@/types/location";

export interface GalleryProps {
  images: ProjectImage[];
  location: Location | null;
}

export interface ProjectHeaderProps {
  name: string;
  coverImage?: string;
  projectKey: string;
  country: string;
  category: string;
  methodology: string;
  methodologyName: string;
  onGoBack: () => void;
}

export type InfoTooltipProps = {
  text: string;
  tooltipText: string;
};
