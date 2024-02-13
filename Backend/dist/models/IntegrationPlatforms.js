"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationPlatforms = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.IntegrationPlatforms = mysql_1.sequelize.define("IntegrationPlatformsInstance", {
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
    url: {
        type: sequelize_1.DataTypes.STRING,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
    },
    ready: {
        type: sequelize_1.DataTypes.TINYINT,
    },
    status: {
        type: sequelize_1.DataTypes.TINYINT,
    }
}, {
    tableName: "integration_platforms",
    timestamps: false
});
