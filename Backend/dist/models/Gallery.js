"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gallery = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.Gallery = mysql_1.sequelize.define("Gallery", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date_created: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    name: {
        type: sequelize_1.DataTypes.STRING
    },
    description: {
        type: sequelize_1.DataTypes.STRING
    },
    file: {
        type: sequelize_1.DataTypes.STRING
    },
    extension: {
        type: sequelize_1.DataTypes.STRING
    },
    size: {
        type: sequelize_1.DataTypes.INTEGER
    },
    dimension: {
        type: sequelize_1.DataTypes.STRING
    },
    folder: {
        type: sequelize_1.DataTypes.INTEGER
    },
    status: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 1
    }
}, {
    tableName: "gallery",
    timestamps: false
});
