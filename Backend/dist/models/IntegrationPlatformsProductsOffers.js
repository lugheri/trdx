"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationPlatformsProductsOffers = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.IntegrationPlatformsProductsOffers = mysql_1.sequelize.define("IntegrationPlatformsProductsOffersInstance", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    product_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    offer: {
        type: sequelize_1.DataTypes.STRING
    },
    description: {
        type: sequelize_1.DataTypes.STRING
    },
    email_copy: {
        type: sequelize_1.DataTypes.TINYINT,
    },
    status: {
        type: sequelize_1.DataTypes.TINYINT,
    }
}, {
    tableName: "integration_platforms_products_offers",
    timestamps: false
});
