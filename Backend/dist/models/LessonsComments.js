"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonsComments = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
const Students_1 = require("./Students");
exports.LessonsComments = mysql_1.sequelize.define('LessonsComment', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    date_created: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    lesson_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    student_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    teacher_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    answers_comment_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    comment: {
        type: sequelize_1.DataTypes.STRING
    },
    public: {
        type: sequelize_1.DataTypes.INTEGER
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER
    }
}, {
    tableName: 'lessons_comments',
    timestamps: false
});
//LessonsComments.belongsTo(LessonsCommentsLikes, { foreignKey: 'id', targetKey: 'comment_id'});
//LessonsComments.belongsTo(Students, {foreignKey:'student_id', targetKey: 'id'})
exports.LessonsComments.hasOne(Students_1.Students, { foreignKey: 'id', sourceKey: 'student_id' });
