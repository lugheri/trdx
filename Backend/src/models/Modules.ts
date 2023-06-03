import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

import { SecurityPolicies, SecurityPoliciesInstance } from './SecurityPolicies';

export interface ModulesInstance extends Model{
  id:number;
  parent:number;
  name:string;
  alias:string;
  icon:string;
  description:string;
  type:string;
  order:number;
  status:number;
}

export const Modules = sequelize.define<ModulesInstance>('Modules',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  parent:{
    type:DataTypes.INTEGER
  },
  name:{
    type:DataTypes.STRING
  },
  alias:{
    type:DataTypes.STRING
  },
  icon:{
    type:DataTypes.STRING
  },
  description:{
    type:DataTypes.STRING
  }, 
  type:{
    type:DataTypes.STRING
  },
  order:{
    type:DataTypes.INTEGER
  },
  status:{
    type:DataTypes.TINYINT
  }
},{
  tableName: 'sys_modules',
  timestamps:false
})
Modules.hasOne(SecurityPolicies, { foreignKey: 'module_id', sourceKey: 'id'});