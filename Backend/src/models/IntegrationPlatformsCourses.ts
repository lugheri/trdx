import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface IntegrationPlatformsCoursesInstance extends Model{
  id:number;
  product_id:number;
  offer_id:number;
  course_id_students:number;
  validity_contract:string;
}

export const IntegrationPlatformsCourses = sequelize.define<IntegrationPlatformsCoursesInstance>("IntegrationPlatformsCoursesInstance",{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  product_id:{
    type:DataTypes.INTEGER
  },
  offer_id:{
    type:DataTypes.INTEGER
  },
  course_id_students:{
    type:DataTypes.INTEGER
  },
  validity_contract:{
    type:DataTypes.STRING,
  }
},{
  tableName:"integration_platforms_courses",
  timestamps:false
})

