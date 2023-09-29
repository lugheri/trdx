import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface ContentHomeConfigInstance extends Model{
  id:number;
  idvideo_welcome:string;
  video_platform:string;
  button_init_cta:string;
  button_init_link:string;
  information_text:string;
  status:number;
}

export const ContentHomeConfig = sequelize.define<ContentHomeConfigInstance>('ContentHomeConfigInstance',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  idvideo_welcome:{
    type:DataTypes.STRING
  }, 
  video_platform:{
    type:DataTypes.STRING
  },
  button_init_cta:{
    type:DataTypes.STRING
  },
  button_init_link:{
    type:DataTypes.STRING
  },
  information_text:{
    type:DataTypes.STRING
  },
  status:{
    type:DataTypes.INTEGER
  }
},{
  tableName: 'content_home_configs',
  timestamps:false
})