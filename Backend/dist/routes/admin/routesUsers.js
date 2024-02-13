"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserController_1 = __importDefault(require("../../controllers/UserController"));
exports.default = (routes) => {
    routes.post("/newUser", UserController_1.default.newUser);
    routes.get("/getUser/:userId", UserController_1.default.getUser);
    routes.patch("/EditUser/:userId", UserController_1.default.editUser);
    routes.delete("/RemoveUser/:userId", UserController_1.default.removeUser);
    routes.post("/listUsers", UserController_1.default.listUsers);
};
