"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailCopy = void 0;
const mysql_1 = require("../instances/mysql");
const sequelize_1 = require("sequelize");
exports.EmailCopy = mysql_1.sequelize.define("EmailCopy", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    title: {
        type: sequelize_1.DataTypes.STRING
    },
    subject: {
        type: sequelize_1.DataTypes.STRING
    },
    body: {
        type: sequelize_1.DataTypes.STRING
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER
    },
}, {
    tableName: "email_copys",
    timestamps: false
});
