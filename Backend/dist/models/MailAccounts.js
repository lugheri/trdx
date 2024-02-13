"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailAccounts = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.MailAccounts = mysql_1.sequelize.define('MailAccounts', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    name: {
        type: sequelize_1.DataTypes.STRING
    },
    host: {
        type: sequelize_1.DataTypes.STRING
    },
    port: {
        type: sequelize_1.DataTypes.INTEGER
    },
    secure: {
        type: sequelize_1.DataTypes.INTEGER
    },
    user: {
        type: sequelize_1.DataTypes.STRING
    },
    pass: {
        type: sequelize_1.DataTypes.INTEGER
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER
    }
}, {
    tableName: "mail_accounts",
    timestamps: false
});
