"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonsAttachments = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.LessonsAttachments = mysql_1.sequelize.define('LessonsAttachments', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    date_created: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    course_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    module_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    lesson_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    name: {
        type: sequelize_1.DataTypes.STRING
    },
    description: {
        type: sequelize_1.DataTypes.STRING
    },
    type: {
        type: sequelize_1.DataTypes.STRING
    },
    material: {
        type: sequelize_1.DataTypes.STRING
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER
    }
}, {
    tableName: 'lessons_attachments',
    timestamps: false
});
