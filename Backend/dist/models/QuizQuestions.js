"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizQuestion = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.QuizQuestion = mysql_1.sequelize.define('QuizQuestion', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    quiz_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    type_question: {
        type: sequelize_1.DataTypes.STRING
    },
    question: {
        type: sequelize_1.DataTypes.STRING
    },
    order: {
        type: sequelize_1.DataTypes.INTEGER
    },
    question_grade: {
        type: sequelize_1.DataTypes.DECIMAL
    },
    public: {
        type: sequelize_1.DataTypes.TINYINT,
    },
    status: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 1
    }
}, {
    tableName: 'quiz_questions',
    timestamps: false
});
