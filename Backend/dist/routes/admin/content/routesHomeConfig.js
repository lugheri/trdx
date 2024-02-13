"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HomeConfigController_1 = __importDefault(require("../../../controllers/HomeConfigController"));
exports.default = (routes) => {
    //Video or Image Home Community
    routes.post("/updateVideoWelcomeCommunity", HomeConfigController_1.default.updateVideoWelcomeCommunity);
    routes.get("/getVideoWelcomeCommunity", HomeConfigController_1.default.getVideoWelcomeCommunity);
    //Text Home Community
    routes.get("/getTextHomeCommunity", HomeConfigController_1.default.getTextHomeCommunity);
    routes.post("/updateTextHomeCommunity", HomeConfigController_1.default.updateTextHomeCommunity);
    //Buttons Home Community
    routes.post("/newButtonCommunity", HomeConfigController_1.default.newButtonCommunity);
    routes.get("/getButtonsCommunity", HomeConfigController_1.default.getButtonsCommunity);
    routes.get("/infoButtonCommunity/:button_id", HomeConfigController_1.default.infoButtonCommunity);
    routes.patch("/updateButtonCommunity/:button_id", HomeConfigController_1.default.updateButtonCommunity);
    routes.delete("/deleteButtonCommunity/:button_id", HomeConfigController_1.default.deleteButtonCommunity);
    //Video or Image Home Default
    routes.post("/updateVideoWelcome", HomeConfigController_1.default.updateVideoWelcome);
    routes.get("/getVideoWelcome", HomeConfigController_1.default.getVideoWelcome);
    //Text Home Default
    routes.get("/getTextHome", HomeConfigController_1.default.getTextHome);
    routes.post("/updateTextHome", HomeConfigController_1.default.updateTextHome);
    //Buttons Home Default
    routes.post("/newButton", HomeConfigController_1.default.newButton);
    routes.get("/getButtons", HomeConfigController_1.default.getButtons);
    routes.get("/infoButton/:button_id", HomeConfigController_1.default.infoButton);
    routes.patch("/updateButton/:button_id", HomeConfigController_1.default.updateButton);
    routes.delete("/deleteButton/:button_id", HomeConfigController_1.default.deleteButton);
    //Social Medias
    routes.post("/newSocialMedia", HomeConfigController_1.default.newSocialMedia);
    routes.get("/getSocialMedias", HomeConfigController_1.default.getSocialMedias);
    routes.get("/infoSocialMedia/:media_id", HomeConfigController_1.default.infoSocialMedia);
    routes.patch("/updateSocialMedia/:media_id", HomeConfigController_1.default.updateSocialMedia);
    routes.delete("/deleteSocialMedia/:media_id", HomeConfigController_1.default.deleteSocialMedia);
};
