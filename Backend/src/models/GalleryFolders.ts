import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface GalleryFolderInstance extends Model{
  id:number;
  date_created:string;
  name:string;
  description:string;
  status:number;
}

export const Gallery = sequelize.define<GalleryFolderInstance>("GalleryFolder",{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  date_created:{
    type:DataTypes.DATE
  },
  name:{
    type:DataTypes.STRING
  },
  description:{
    type:DataTypes.STRING
  },
  status:{
    type:DataTypes.TINYINT,
    defaultValue:1
  }
},{
  tableName:"gallery_folders",
  timestamps:false
})