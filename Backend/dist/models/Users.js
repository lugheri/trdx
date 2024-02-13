"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.User = mysql_1.sequelize.define("User", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    photo: {
        type: sequelize_1.DataTypes.INTEGER
    },
    name: {
        type: sequelize_1.DataTypes.STRING
    },
    mail: {
        type: sequelize_1.DataTypes.STRING
    },
    credential: {
        type: sequelize_1.DataTypes.INTEGER
    },
    password: {
        type: sequelize_1.DataTypes.STRING
    },
    reset: {
        type: sequelize_1.DataTypes.TINYINT
    },
    logged: {
        type: sequelize_1.DataTypes.TINYINT
    },
    status: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 1
    }
}, {
    tableName: "sys_users",
    timestamps: true
});
