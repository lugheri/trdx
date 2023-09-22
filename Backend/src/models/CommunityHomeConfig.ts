import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface CommunityHomeConfigInstance extends Model{
  id:number;
  idvideo_welcome:string;
  video_platform:string;
  button_init_cta:string;
  button_init_link:string;
  information_text:string;
  status:number;
}

export const CommunityHomeConfig = sequelize.define<CommunityHomeConfigInstance>('CommunityHomeConfigInstance',{
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
  tableName: 'community_home_configs',
  timestamps:false
})