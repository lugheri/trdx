"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modules = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
const SecurityPolicies_1 = require("./SecurityPolicies");
exports.Modules = mysql_1.sequelize.define('Modules', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    parent: {
        type: sequelize_1.DataTypes.INTEGER
    },
    name: {
        type: sequelize_1.DataTypes.STRING
    },
    alias: {
        type: sequelize_1.DataTypes.STRING
    },
    icon: {
        type: sequelize_1.DataTypes.STRING
    },
    description: {
        type: sequelize_1.DataTypes.STRING
    },
    type: {
        type: sequelize_1.DataTypes.STRING
    },
    order: {
        type: sequelize_1.DataTypes.INTEGER
    },
    status: {
        type: sequelize_1.DataTypes.TINYINT
    }
}, {
    tableName: 'sys_modules',
    timestamps: false
});
exports.Modules.hasOne(SecurityPolicies_1.SecurityPolicies, { foreignKey: 'module_id', sourceKey: 'id' });
