export interface IFolderGallery{
  id:number;
	date_created:string;
	name:string;
	description:string;
	status:number;
}

export interface IFileGallery{
  id:number;
  date_created:string;
  name:string;
  description:string;
  file:string;
  extension:string;
  size:number;
  folder:number;
  status:number;
}      