import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface HomeButtonsCommunityInstance extends Model{
  id:number;
  type:string;
  icon:string;
  name:string;
  link:string;
  order:number;
  status:number;
}

export const HomeButtonsCommunity = sequelize.define<HomeButtonsCommunityInstance>('HomeButtonsCommunityInstance',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  type:{
    type:DataTypes.STRING
  },
  icon:{
    type:DataTypes.STRING
  },
  name:{
    type:DataTypes.STRING
  },
  link:{
    type:DataTypes.STRING
  },
  order:{
    type:DataTypes.NUMBER
  },
  status:{
    type:DataTypes.NUMBER,
    defaultValue:1
  }
},{
  tableName:'home_buttons_community',
  timestamps:false
})

