import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface UsersProfilePhotosInstance extends Model{
  id:number;
  date_created:string;
  name:string;
  description:string;
  file:string;
  extension:string;
  size:number;
  status:number;
}

export const UsersProfilePhotos = sequelize.define<UsersProfilePhotosInstance>("UsersProfilePhotosInstance",{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  date_created:{
    type:DataTypes.DATE,
    defaultValue:DataTypes.NOW
  },
  name:{
    type:DataTypes.STRING
  },
  description:{
    type:DataTypes.STRING
  },
  file:{
    type:DataTypes.STRING
  },
  extension:{
    type:DataTypes.STRING
  },
  size:{
    type:DataTypes.INTEGER
  },
  status:{
    type:DataTypes.TINYINT,
    defaultValue:1
  }
},{
  tableName:"users_profile_photos",
  timestamps:false
})