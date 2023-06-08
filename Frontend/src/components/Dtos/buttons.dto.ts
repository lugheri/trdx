import * as Fas from "@fortawesome/free-solid-svg-icons";

export type ToggleType = {
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ToggleDarkModeType = {
  value?: boolean;
}

export type ButtonType = {
  btn?: 'info'|'success'|'warning'|'error'|'muted'; 
  type?: 'default'|'outline'|'notline'; 
  size?: 'sm'|'md'|'lg'; 
  name?: string;
  border?: 'square'|'rounded'|'circle';
  icon?:null | keyof typeof Fas ;
  onClick?: () => void;
};