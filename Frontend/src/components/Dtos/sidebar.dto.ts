import * as Fas from "@fortawesome/free-solid-svg-icons";

export type NavLinkProps = {
  to: string;
  icon:keyof typeof Fas | null;
  name?:string;
  side:'open'|'closed';
};

export type itemSide = {
  id: number;
	parent: number;
	name: string;
  alias: string | null;
	icon:null | keyof typeof Fas ;
	description: string | null;
	type:string;
	order: number;
	status: number;
}