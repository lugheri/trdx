import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface IntegrationPlatformsInstance extends Model{
  id:number;
  date:string;
  name:string;
  url:string;
  description:string;
  ready:number;
  status:number;
}

export const IntegrationPlatforms = sequelize.define<IntegrationPlatformsInstance>("IntegrationPlatformsInstance",{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  date:{
    type:DataTypes.DATE,
    defaultValue:DataTypes.NOW
  },
  name:{
    type:DataTypes.STRING
  },
  url:{
    type:DataTypes.STRING,
  },
  description:{
    type:DataTypes.STRING,
  },
  ready:{
    type:DataTypes.TINYINT,
  },
  status:{
    type:DataTypes.TINYINT,
  }
},{
  tableName:"integration_platforms",
  timestamps:false
})

