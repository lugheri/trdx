import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface CommunitySocialMediasInstance extends Model{
  id:number;
  socialmedia:string;
  text:string;
  cta:string;
  link:string;
  order:number;
  status:number;
}

export const CommunitySocialMedias = sequelize.define<CommunitySocialMediasInstance>('CommunitySocialMedias',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  socialmedia:{
    type:DataTypes.STRING
  }, 
  text:{
    type:DataTypes.STRING
  },
  cta:{
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
  tableName: 'community_socialmedias',
  timestamps:false
})