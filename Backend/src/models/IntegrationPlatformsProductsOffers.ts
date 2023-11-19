import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface IntegrationPlatformsProductsOffersInstance extends Model{
  id:number;
  product_id:number;
  offer:string;
  description:string;
  status:number;
}

export const IntegrationPlatformsProductsOffers = sequelize.define<IntegrationPlatformsProductsOffersInstance>("IntegrationPlatformsProductsOffersInstance",{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  product_id:{
    type:DataTypes.INTEGER
  },
  offer:{
    type:DataTypes.STRING
  },
  description:{
    type:DataTypes.STRING
  },
  status:{
    type:DataTypes.TINYINT,
  }
},{
  tableName:"integration_platforms_products_offers",
  timestamps:false
})

