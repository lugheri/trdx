"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationHooksHistory = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.IntegrationHooksHistory = mysql_1.sequelize.define('IntegrationHooksHistory', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    integration: {
        type: sequelize_1.DataTypes.STRING
    },
    product_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    product_name: {
        type: sequelize_1.DataTypes.STRING
    },
    offer: {
        type: sequelize_1.DataTypes.STRING
    },
    pay_status: {
        type: sequelize_1.DataTypes.STRING
    },
    student_name: {
        type: sequelize_1.DataTypes.STRING
    },
    student_mail: {
        type: sequelize_1.DataTypes.STRING
    },
    data_post: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    tableName: 'integration_hooks_history',
    timestamps: false
});
