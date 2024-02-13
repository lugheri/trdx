"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityPolicies = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.SecurityPolicies = mysql_1.sequelize.define('SecurityPolicies', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    level_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    module_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    parent_module_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    active: {
        type: sequelize_1.DataTypes.TINYINT
    }
}, {
    tableName: 'sys_security_policies',
    timestamps: false
});
