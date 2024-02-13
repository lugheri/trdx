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
const IntegrationPlatformsProducts_1 = require("../models/IntegrationPlatformsProducts");
class IntegrationProductService {
    newProduct(dataProduct) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newProduct, created] = yield IntegrationPlatformsProducts_1.IntegrationPlatformsProducts.findOrCreate({
                where: { name: dataProduct.name, integration: dataProduct.integration },
                defaults: dataProduct
            });
            console.info(created);
            return newProduct.id ? newProduct : false;
        });
    }
    getProductsPlatform(status, integration) {
        return __awaiter(this, void 0, void 0, function* () {
            const listProductsIntegrations = yield IntegrationPlatformsProducts_1.IntegrationPlatformsProducts.findAll({
                where: { integration: integration, status: status },
            });
            return listProductsIntegrations;
        });
    }
    infoProduct(product_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const infoProduct = yield IntegrationPlatformsProducts_1.IntegrationPlatformsProducts.findByPk(product_id);
            return infoProduct;
        });
    }
    infoProductByCode(product_id_platform) {
        return __awaiter(this, void 0, void 0, function* () {
            const infoProduct = yield IntegrationPlatformsProducts_1.IntegrationPlatformsProducts.findOne({
                where: { product_id_platform: product_id_platform, status: 1 },
            });
            return infoProduct;
        });
    }
    editProduct(product_id, dataProduct) {
        return __awaiter(this, void 0, void 0, function* () {
            yield IntegrationPlatformsProducts_1.IntegrationPlatformsProducts.update(dataProduct, { where: { id: product_id } });
            return true;
        });
    }
    removeProduct(product_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield IntegrationPlatformsProducts_1.IntegrationPlatformsProducts.destroy({ where: { id: product_id } });
            return true;
        });
    }
}
exports.default = new IntegrationProductService();
