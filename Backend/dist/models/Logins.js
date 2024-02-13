"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logins = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.Logins = mysql_1.sequelize.define("Logins", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    date: {
        type: sequelize_1.DataTypes.DATE
    },
    hour: {
        type: sequelize_1.DataTypes.TIME
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    action: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    tableName: "logins",
    timestamps: false
});
