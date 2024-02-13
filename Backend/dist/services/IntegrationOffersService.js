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
const IntegrationPlatformsProductsOffers_1 = require("../models/IntegrationPlatformsProductsOffers");
class IntegrationOffersService {
    newOffer(dataOffer) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newOffer, created] = yield IntegrationPlatformsProductsOffers_1.IntegrationPlatformsProductsOffers.findOrCreate({
                where: { product_id: dataOffer.product_id, offer: dataOffer.offer },
                defaults: dataOffer
            });
            console.info(created);
            return newOffer.id ? newOffer : false;
        });
    }
    getOffers(status, product_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const listOffers = yield IntegrationPlatformsProductsOffers_1.IntegrationPlatformsProductsOffers.findAll({
                where: { product_id: product_id, status: status },
            });
            return listOffers;
        });
    }
    infoOffer(offer_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const infoOffer = yield IntegrationPlatformsProductsOffers_1.IntegrationPlatformsProductsOffers.findByPk(offer_id);
            return infoOffer;
        });
    }
    infoOfferByOfferPlatform(offer_platform, product_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const infoOffer = yield IntegrationPlatformsProductsOffers_1.IntegrationPlatformsProductsOffers.findOne({
                where: { offer: offer_platform, product_id: product_id }
            });
            return infoOffer;
        });
    }
    editOffer(offer_id, dataOffer) {
        return __awaiter(this, void 0, void 0, function* () {
            yield IntegrationPlatformsProductsOffers_1.IntegrationPlatformsProductsOffers.update(dataOffer, { where: { id: offer_id } });
            return true;
        });
    }
    removeOffer(offer_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield IntegrationPlatformsProductsOffers_1.IntegrationPlatformsProductsOffers.destroy({ where: { id: offer_id } });
            return true;
        });
    }
}
exports.default = new IntegrationOffersService();
