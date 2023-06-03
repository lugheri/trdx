import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface SecurityPoliciesInstance extends Model{
  id:number;
  level_id:number;
  module_id:number;
  parent_module_id:number;
  active:number;  
}

export const SecurityPolicies = sequelize.define<SecurityPoliciesInstance>('SecurityPolicies',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  level_id:{
    type:DataTypes.INTEGER
  },
  module_id:{
    type:DataTypes.INTEGER
  },
  parent_module_id:{
    type:DataTypes.INTEGER
  },
  active:{
    type:DataTypes.TINYINT
  }
},{
  tableName: 'sys_security_policies',
  timestamps:false
})
