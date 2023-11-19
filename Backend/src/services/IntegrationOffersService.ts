import { IntegrationOfferType } from "../controllers/Dtos/integration.dto";
import { IntegrationPlatformsProductsOffers, IntegrationPlatformsProductsOffersInstance } from "../models/IntegrationPlatformsProductsOffers";

class IntegrationOffersService{

  async newOffer(dataOffer:IntegrationOfferType):Promise<boolean | IntegrationPlatformsProductsOffersInstance>{
    const [newOffer,created] = await IntegrationPlatformsProductsOffers.findOrCreate({
      where:{product_id:dataOffer.product_id,offer:dataOffer.offer},
      defaults:dataOffer
    })
    console.info(created)
    return newOffer.id ? newOffer : false
  }

  async getOffers(status:number,product_id:number){
    const listOffers = await IntegrationPlatformsProductsOffers.findAll({
      where: {product_id:product_id,status: status},
    })
    return listOffers
  }

  async infoOffer(offer_id:number){
    const infoOffer = await IntegrationPlatformsProductsOffers.findByPk(offer_id)
    return infoOffer
  }

  async infoOfferByOfferPlatform(offer_platform:string,product_id:number){
    const infoOffer = await IntegrationPlatformsProductsOffers.findOne({
      where: {offer:offer_platform,product_id:product_id}
    })
    return infoOffer
  }

  async editOffer(offer_id:number,dataOffer:IntegrationOfferType){
    await IntegrationPlatformsProductsOffers.update(dataOffer,{where:{id:offer_id}})
    return true;
  }

  async removeOffer(offer_id:number){
    await IntegrationPlatformsProductsOffers.destroy({where:{id:offer_id}})
    return true;
  }

}
export default new IntegrationOffersService();