import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface CommunityHomeConfigInstance extends Model{
  id:number;
  idvideo_welcome:string;
  video_platform:string;
  title_text:string;
  text:string;
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
  title_text:{
    type:DataTypes.STRING,
    defaultValue:""
  },
  text:{
    type:DataTypes.STRING,
    defaultValue:""
  },
  status:{
    type:DataTypes.INTEGER,
    defaultValue:1
  }
},{
  tableName: 'community_home_configs',
  timestamps:false
})