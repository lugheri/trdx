"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesModules = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.CoursesModules = mysql_1.sequelize.define('CoursesModules', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    course_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    image: {
        type: sequelize_1.DataTypes.INTEGER
    },
    type_module: {
        type: sequelize_1.DataTypes.STRING
    },
    module: {
        type: sequelize_1.DataTypes.STRING
    },
    description: {
        type: sequelize_1.DataTypes.STRING
    },
    order: {
        type: sequelize_1.DataTypes.INTEGER
    },
    visibility: {
        type: sequelize_1.DataTypes.INTEGER
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER
    }
}, {
    tableName: 'courses_modules',
    timestamps: false
});
