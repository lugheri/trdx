"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommentsController_1 = __importDefault(require("../../../controllers/CommentsController"));
exports.default = (routes) => {
    routes.get('/totalComments/:type', CommentsController_1.default.totalComments);
    routes.get('/getComments/:type/:page', CommentsController_1.default.getComments);
    routes.get('/getAnswers/:commentId', CommentsController_1.default.getAnswers);
    routes.get("/searchComment/:params/:type", CommentsController_1.default.searchComment);
    routes.post("/newAnswer", CommentsController_1.default.newAnswer);
    routes.get("/infoComment/:commentId", CommentsController_1.default.infoComment);
    routes.patch("/editComment/:commentId", CommentsController_1.default.editComment);
    //Comments by Student
    routes.get('/getCommentsStudent/:studentId', CommentsController_1.default.getCommentsStudent);
};
