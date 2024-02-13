"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizStudentsGrade = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.QuizStudentsGrade = mysql_1.sequelize.define('QuizStudentsGrade', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    quiz_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    student_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    grade: {
        type: sequelize_1.DataTypes.DECIMAL
    },
    completed: {
        type: sequelize_1.DataTypes.TINYINT,
    }
}, {
    tableName: 'quiz_students_grade',
    timestamps: false
});
