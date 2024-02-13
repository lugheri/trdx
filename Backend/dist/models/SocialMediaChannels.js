"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialMediaChannels = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.SocialMediaChannels = mysql_1.sequelize.define('SocialMediaChannels', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    social_media: {
        type: sequelize_1.DataTypes.STRING
    },
    text: {
        type: sequelize_1.DataTypes.STRING
    },
    link: {
        type: sequelize_1.DataTypes.STRING
    },
    order: {
        type: sequelize_1.DataTypes.INTEGER
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER
    }
}, {
    tableName: 'social_media_channels',
    timestamps: false
});
