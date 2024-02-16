export interface ICommunityMessage{
  id:number;
  date_created:string;
  is_student:number;
  user_id:number;
  user_photo:number;
  user_name:string;
  user_last_message:number;
  message:string;
  media:number;
  status:number;
}

export interface ICommunityMedia{
  id:number;
  date_created:string;
  user_id:number;
  file:string;
  type_media:string;
  duration:number;
  status:number;
}
