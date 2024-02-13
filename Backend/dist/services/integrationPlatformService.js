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
const IntegrationPlatforms_1 = require("../models/IntegrationPlatforms");
class IntegrationPlatformService {
    newIntegration(dataIntegration) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newIntegration, created] = yield IntegrationPlatforms_1.IntegrationPlatforms.findOrCreate({
                where: { name: dataIntegration.name },
                defaults: dataIntegration
            });
            console.info(created);
            return newIntegration.id ? newIntegration : false;
        });
    }
    getIntegrations(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const listPlatformIntegrations = yield IntegrationPlatforms_1.IntegrationPlatforms.findAll({
                where: { status: status },
            });
            return listPlatformIntegrations;
        });
    }
    infoIntegrations(integration_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const infoIntegration = yield IntegrationPlatforms_1.IntegrationPlatforms.findByPk(integration_id);
            return infoIntegration;
        });
    }
    editIntegration(integration_id, dataIntegration) {
        return __awaiter(this, void 0, void 0, function* () {
            yield IntegrationPlatforms_1.IntegrationPlatforms.update(dataIntegration, { where: { id: integration_id } });
            return true;
        });
    }
}
exports.default = new IntegrationPlatformService();
