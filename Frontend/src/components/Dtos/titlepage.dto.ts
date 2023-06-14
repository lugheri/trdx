import * as Fas from "@fortawesome/free-solid-svg-icons";

export type TitlePageType = {
  icon?:null | keyof typeof Fas ;
  title?: string;
  description?: string;
  rightComponent?: React.ReactNode;
}