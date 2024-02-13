"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const IntegrationHooksHistory_1 = require("../models/IntegrationHooksHistory");
class IntegrationHooksHistoryService {
    createNewCourse(dataHook) {
        return __awaiter(this, void 0, void 0, function* () {
            const newHook = yield IntegrationHooksHistory_1.IntegrationHooksHistory.create(dataHook);
            return newHook.id ? newHook : false;
        });
    }
    listIntegrationHooks(page, integration, product_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const p = page - 1;
            const qtdRegPage = 30;
            const offset = qtdRegPage * p;
            const listHooks = yield IntegrationHooksHistory_1.IntegrationHooksHistory.findAll({
                where: { integration: integration, product_id: product_id },
                order: [['id', 'DESC']],
                offset: offset,
                limit: qtdRegPage
            });
            return listHooks;
        });
    }
    getHook(hookId) {
        return __awaiter(this, void 0, void 0, function* () {
            const hook = yield IntegrationHooksHistory_1.IntegrationHooksHistory.findByPk(hookId);
            return hook ? hook : false;
        });
    }
}
exports.default = new IntegrationHooksHistoryService();
