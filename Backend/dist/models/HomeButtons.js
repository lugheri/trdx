"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeButtons = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.HomeButtons = mysql_1.sequelize.define('HomeButtonsInstance', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    type: {
        type: sequelize_1.DataTypes.STRING
    },
    icon: {
        type: sequelize_1.DataTypes.STRING
    },
    name: {
        type: sequelize_1.DataTypes.STRING
    },
    link: {
        type: sequelize_1.DataTypes.STRING
    },
    order: {
        type: sequelize_1.DataTypes.NUMBER
    },
    status: {
        type: sequelize_1.DataTypes.NUMBER,
        defaultValue: 1
    }
}, {
    tableName: 'home_buttons',
    timestamps: false
});
