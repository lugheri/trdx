import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface IntegrationPlatformsProductsInstance extends Model{
  id:number;
  integration:string;
  product_id_platform:string;
  community_access:number;
  name:number;
  active:number;
  status:number;
}

export const IntegrationPlatformsProducts = sequelize.define<IntegrationPlatformsProductsInstance>("IntegrationPlatformsProductsInstance",{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  integration:{
    type:DataTypes.STRING
  },
  product_id_platform:{
    type:DataTypes.STRING
  },
  community_access:{
    type:DataTypes.TINYINT
  },
  name:{
    type:DataTypes.STRING
  },
  active:{
    type:DataTypes.TINYINT,
  },
  status:{
    type:DataTypes.TINYINT,
  }
},{
  tableName:"integration_platforms_products",
  timestamps:false
})

