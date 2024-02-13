"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationPlatformsProducts = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.IntegrationPlatformsProducts = mysql_1.sequelize.define("IntegrationPlatformsProductsInstance", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    integration: {
        type: sequelize_1.DataTypes.STRING
    },
    product_id_platform: {
        type: sequelize_1.DataTypes.STRING
    },
    community_access: {
        type: sequelize_1.DataTypes.TINYINT
    },
    name: {
        type: sequelize_1.DataTypes.STRING
    },
    active: {
        type: sequelize_1.DataTypes.TINYINT,
    },
    status: {
        type: sequelize_1.DataTypes.TINYINT,
    }
}, {
    tableName: "integration_platforms_products",
    timestamps: false
});
