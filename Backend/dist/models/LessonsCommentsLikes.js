"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonsCommentsLikes = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.LessonsCommentsLikes = mysql_1.sequelize.define('LessonsCommentsLikes', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    comment_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    student_id: {
        type: sequelize_1.DataTypes.INTEGER,
    }
}, {
    tableName: 'lessons_comments_likes',
    timestamps: false
});
