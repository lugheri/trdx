import * as Fas from "@fortawesome/free-solid-svg-icons";
export type ModalType = {
  component: React.ReactNode;
  className?:string
} 


export type ModalTitleType = {
  icon: keyof typeof Fas ;
  title:string;
  subtitle?:string;
  close?:()=>void;
} 