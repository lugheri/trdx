import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface SocialMediaChannelsInstance extends Model{
  id:number;
  social_media:string;
  text:string;
  link:string;
  order:number;
  status:number;
}

export const SocialMediaChannels = sequelize.define<SocialMediaChannelsInstance>('SocialMediaChannels',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  social_media:{
    type:DataTypes.STRING
  }, 
  text:{
    type:DataTypes.STRING
  }, 
  link:{
    type:DataTypes.STRING
  },
  order:{
    type:DataTypes.INTEGER
  },
  status:{
    type:DataTypes.INTEGER
  }
},{
  tableName: 'social_media_channels',
  timestamps:false
})