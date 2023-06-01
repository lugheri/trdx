import * as Fas from "@fortawesome/free-solid-svg-icons";

export type NavLinkProps = {
  to: string;
  icon?:keyof typeof Fas;
  name?:string;
  side:'open'|'closed';
};