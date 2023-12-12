import { IntegrationProductType } from "../controllers/Dtos/integration.dto";
import { IntegrationPlatformsProducts, IntegrationPlatformsProductsInstance } from "../models/IntegrationPlatformsProducts";

class IntegrationProductService{

  async newProduct(dataProduct:IntegrationProductType):Promise<boolean | IntegrationPlatformsProductsInstance>{
    const [newProduct,created] = await IntegrationPlatformsProducts.findOrCreate({
      where:{name:dataProduct.name,integration:dataProduct.integration},
      defaults:dataProduct
    })
    console.info(created)
    return newProduct.id ? newProduct : false
  }

  async getProductsPlatform(status:number,integration:string){
    const listProductsIntegrations = await IntegrationPlatformsProducts.findAll({
      where: {integration:integration,status: status},
    })
    return listProductsIntegrations
  }

  async infoProduct(product_id:number){
    const infoProduct = await IntegrationPlatformsProducts.findByPk(product_id)
    return infoProduct
  }

  async infoProductByCode(product_id_platform:number){
    const infoProduct = await IntegrationPlatformsProducts.findOne({
      where: {product_id_platform:product_id_platform,status: 1},
    })
    return infoProduct
  }

  async editProduct(product_id:number,dataProduct:IntegrationProductType){
    await IntegrationPlatformsProducts.update(dataProduct,{where:{id:product_id}})
    return true;
  }

  async removeProduct(product_id:number){
    await IntegrationPlatformsProducts.destroy({where:{id:product_id}})
    return true;
  }

}
export default new IntegrationProductService();