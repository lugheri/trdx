import { sequelize } from '../instances/mysql';
import { DataTypes, Model } from "sequelize";

export interface EmailCopyInstance extends Model{
  id:number;
  date:string;
  title:string;
  subject:string;
  body:string;
  status:number;
}

export const EmailCopy = sequelize.define<EmailCopyInstance>("EmailCopy",{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  date:{
    type:DataTypes.DATE,
    defaultValue:DataTypes.NOW
  },
  title:{
    type:DataTypes.STRING
  },
  subject:{
    type:DataTypes.STRING
  },
  body:{
    type:DataTypes.STRING
  },
  status:{
    type:DataTypes.INTEGER
  },
},{
  tableName:"email_copys",
  timestamps:false
})