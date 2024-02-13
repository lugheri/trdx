"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeConfig = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.HomeConfig = mysql_1.sequelize.define('HomeConfigInstance', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    idvideo_welcome: {
        type: sequelize_1.DataTypes.STRING
    },
    video_platform: {
        type: sequelize_1.DataTypes.STRING
    },
    image_gallery: {
        type: sequelize_1.DataTypes.INTEGER
    },
    title_text: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: ""
    },
    text: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: ""
    },
    additional_text: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: ""
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    tableName: 'home_config',
    timestamps: false
});
