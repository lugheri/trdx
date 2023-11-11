import * as Fas from "@fortawesome/free-solid-svg-icons";

export interface WelcomeVideo{
  idvideo_welcome: string | null,
  video_platform:string | null,
  image_gallery:number | null
}

export interface WelcomeText{
  title_text: string | null,
  text:string | null,
  additional_text:string | null,
}

export interface WelcomeButtons{
  type: 'default'|'light'|'info'|'success'|'warning'|'error'|'muted',
  icon: null | keyof typeof Fas,
  name: string,
  link:string,
  order:number,
  status:number
}

export interface SocialMedia{
  id:number,
  social_media: string,
  text: string,
  link:string,
  order:number,
  status:number
}



