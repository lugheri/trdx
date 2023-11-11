import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface HomeConfigCommunityInstance extends Model{
  id:number;
  idvideo_welcome:string;
  video_platform:string;
  image_gallery:number;
  title_text:string;
  text:string;
  additional_text:string;
  status:number;
}

export const HomeConfigCommunity = sequelize.define<HomeConfigCommunityInstance>('HomeConfigCommunityInstance',{
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
  image_gallery:{
    type:DataTypes.INTEGER
  },
  title_text:{
    type:DataTypes.STRING,
    defaultValue:""
  },
  text:{
    type:DataTypes.STRING,
    defaultValue:""
  },
  additional_text:{
    type:DataTypes.STRING,
    defaultValue:""
  },
  status:{
    type:DataTypes.INTEGER,
    defaultValue:1
  }
},{
  tableName: 'home_config_community',
  timestamps:false
})