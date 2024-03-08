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
  public:number;
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

export interface ICommunityBlockMember{
  id:number;
  date:string;
  user_block_responsible:number;
  member_id:number;
  block_audio_message:number;
  block_media_message:number;
  block_message_message:number;
  block_access:number;
}

