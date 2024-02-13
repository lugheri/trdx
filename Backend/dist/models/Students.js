"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Students = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.Students = mysql_1.sequelize.define("Students", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    since: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    community: {
        type: sequelize_1.DataTypes.TINYINT
    },
    type: {
        type: sequelize_1.DataTypes.STRING
    },
    photo: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    name: {
        type: sequelize_1.DataTypes.STRING
    },
    mail: {
        type: sequelize_1.DataTypes.STRING
    },
    born: {
        type: sequelize_1.DataTypes.DATE
    },
    phone: {
        type: sequelize_1.DataTypes.STRING
    },
    gender: {
        type: sequelize_1.DataTypes.STRING,
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
    },
    password: {
        type: sequelize_1.DataTypes.STRING
    },
    logged: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 0
    },
    reset: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 1
    },
    status: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 1
    }
}, {
    tableName: "students",
    timestamps: false
});
