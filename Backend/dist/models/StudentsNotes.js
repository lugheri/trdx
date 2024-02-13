"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsNotes = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.StudentsNotes = mysql_1.sequelize.define('StudentsNotes', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    date_created: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    student_id: {
        type: sequelize_1.DataTypes.INTEGER
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
    note: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    tableName: 'students_notes',
    timestamps: false
});
