"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiController_1 = __importDefault(require("../controllers/ApiController"));
exports.default = (routes) => {
    routes.get('/testApi', ApiController_1.default.checkHealth);
    routes.post('/api/hotmart', ApiController_1.default.hotmart);
};
