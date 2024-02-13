"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsCourses = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.StudentsCourses = mysql_1.sequelize.define("StudentsCourses", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date_created: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    date_validity: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    payment_cycle: {
        type: sequelize_1.DataTypes.STRING
    },
    student_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    course_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    concluded: {
        type: sequelize_1.DataTypes.INTEGER
    },
    status: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 1
    }
}, {
    tableName: "students_courses",
    timestamps: false
});
