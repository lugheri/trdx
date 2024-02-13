"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesLessons = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
const LessonsViewed_1 = require("./LessonsViewed");
exports.CoursesLessons = mysql_1.sequelize.define('CoursesLessons', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    course_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    module_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    date_created: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    type_lesson: {
        type: sequelize_1.DataTypes.STRING
    },
    max_time: {
        type: sequelize_1.DataTypes.STRING
    },
    top_score: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    teacher_id: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    type_content: {
        type: sequelize_1.DataTypes.STRING
    },
    link: {
        type: sequelize_1.DataTypes.STRING
    },
    video_platform: {
        type: sequelize_1.DataTypes.STRING
    },
    image: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    name: {
        type: sequelize_1.DataTypes.STRING
    },
    description: {
        type: sequelize_1.DataTypes.STRING
    },
    tags: {
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
    tableName: 'courses_lessons',
    timestamps: false
});
exports.CoursesLessons.hasOne(LessonsViewed_1.LessonsViewed, { foreignKey: 'lesson_id', sourceKey: 'id' });
