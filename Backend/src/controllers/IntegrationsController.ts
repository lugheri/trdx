import { Request, Response } from 'express';

interface IHotmartApi_V1{
  callback_type: number,
  hottok: string,
  aff: string,
  aff_name: string,
  cms_aff: string,
  cms_aff_currency: string,
  currency: string,
  transaction: string,
  xcod: string,
  payment_type: string,
  payment_engine: string,
  status: string,
  prod: number,
  prod_name: string,
  producer_name: string,
  producer_document: string,
  producer_legal_nature: string,
  transaction_ext: string,
  purchase_date: string,
  confirmation_purchase_date: string,
  currency_code_from: string,
  currency_code_from_: string,
  original_offer_price: number,
  productOfferPaymentMode: string,
  warranty_date: string,
  product_support_email: string,
  receiver_type: string,
  installments_number: number,
  funnel: boolean,
  order_bump: boolean,
  business_model: string,
  cms_marketplace: number,
  cms_vendor: number,
  off: string,
  price: number,
  full_price: number,
  has_co_production: boolean,
  email: string,
  name: string,
  first_name: string,
  last_name: string,
  doc: string,
  doc_type: string,
  phone_local_code: number,
  phone_number: number,
  address: string,
  address_district: string,
  address_number: number,
  address_comp: string,
  address_city: string,
  address_state: string,
  address_zip_code: string,
  address_country: string,
  address_country_ISO: string,
  phone_checkout_local_code: number,
  phone_checkout_number: number,
  sck: string
}

class IntegrationsController{
 
  async apiHotmart(req:Request,res:Response){
    const version='1.0'
    const data:IHotmartApi_V1 = req.body
    const status = data.status
    const offer = data.off
    const productId = data.prod
    const productName=data.prod_name
    //Customer Info
    const nameCustomer=data.name
    const emailCustomer=data.email
    const document = data.doc
    const typeDoc = data.doc_type
    const numberPhone = `${data.phone_local_code}${data.phone_number}`
    const city = data.address_city
    const state = data.address_state
    //Offer Data
    const price = data.full_price
    const orderBump = data.order_bump
    


    console.log(data)
    res.json(true)

  }
}

export default new IntegrationsController();