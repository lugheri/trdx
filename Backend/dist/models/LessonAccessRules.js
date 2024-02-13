"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonAccessRules = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.LessonAccessRules = mysql_1.sequelize.define("LessonAccessRules", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    lesson_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    rule_access: {
        type: sequelize_1.DataTypes.STRING
    },
    days_to_access: {
        type: sequelize_1.DataTypes.INTEGER
    },
    date_of_access: {
        type: sequelize_1.DataTypes.DATE
    }
}, {
    tableName: "lesson_access_rules",
    timestamps: false
});
