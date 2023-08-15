import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface CoursesValidityContractsInstances extends Model{
  id:number;
  student_id:number;
  course_id:number;
  start_validity:string;  
  end_validity:string;
  payment_cycle:string;
  expire:number;
  lifetime:number;  
}

export const CoursesValidityContracts = sequelize.define<CoursesValidityContractsInstances>('CoursesValidityContracts',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  student_id:{
    type:DataTypes.INTEGER
  },
  course_id:{
    type:DataTypes.INTEGER
  },
  start_validity:{
    type:DataTypes.DATE
  },
  end_validity:{
    type:DataTypes.DATE
  },
  payment_cycle:{
    type:DataTypes.STRING
  },
  expire:{
    type:DataTypes.INTEGER
  },
  lifetime:{
    type:DataTypes.INTEGER
  }
},{
  tableName: 'courses_validity_contracts',
  timestamps:false
})
