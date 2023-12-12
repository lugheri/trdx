import React, { FormEvent,  useState } from "react";
import { Button } from "../../../../../components/Buttons"
import { Card } from "../../../../../components/Cards"
import { TitlePage } from "../../../../../components/Template/TitlePage"
import {  IProducts } from "../../Dtos/integrations.dto"

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from "../../../../../services/api";
import { Modal, TitleModal } from "../../../../../components/Modal";
import { InputForm, SelectForm } from "../../../../../components/Inputs";
import { OffersProducts } from "./OffersIntegrations";

type ProductSetupComponents = {
  openProduct:IProducts,
  setOpenProduct:React.Dispatch<React.SetStateAction<IProducts|null>>
}
export const ProductSetup: React.FC<ProductSetupComponents> = (props) => {
  const [ editProduct, setEditProduct ] = useState<IProducts|null>(null)
  const [ deleteProduct, setDeleteProduct ] = useState<IProducts|null>(null) 
  

  return(
    <div className="flex flex-col">
      <TitlePage
        icon="faWrench" 
        title={`Configurar Produto ${props.openProduct.name}`}
        description={`Configure as ofertas com os cursos deste produto`}
        rightComponent={
          <Button submit btn="muted" icon="faReply" name='Voltar'  onClick={()=>props.setOpenProduct(null)} />
        }/> 
      <Card component={
        <div className="flex w-full justify-between">
          <div className="flex flex-col">
            <p className="text-neutral-100">
              <FontAwesomeIcon className="text-teal-500/50" icon={Fas.faShoppingCart}/> Dados do Produto:
            </p>
            <p className="text-neutral-50 font-light text-sm my-1">
              <b>Código:</b> <span className="text-teal-500">{props.openProduct.product_id_platform}</span>
              { props.openProduct.community_access == 1 && 
                <strong className="text-green-500 ml-32">
                  <FontAwesomeIcon className="opacity-40" icon={Fas.faUsers}/> Este produto dá acesso à comunidade
                </strong>}
            </p>
            <p className="text-neutral-50 font-light text-sm my-1"><b>Produto:</b> {props.openProduct.name}</p>
            <p className="text-neutral-50 font-light text-sm my-1">
              <b>Integração:</b> {props.openProduct.integration}
            </p>           
          </div>
          <div className="flex flex-col">
            <Button 
              btn="info" icon="faEdit" name="Editar Produto"
              onClick={()=>setEditProduct(props.openProduct)}/>
            <Button 
              btn="error" icon="faTrash" type="notline" name="Remover Produto"
              onClick={()=>setDeleteProduct(props.openProduct)}/>
          </div>
        </div>        
      }/>
      <Card component={<OffersProducts product={props.openProduct}/>}/>
      { editProduct && <EditProduct setOpenProduct={props.setOpenProduct} product={editProduct} close={setEditProduct}/> }
      { deleteProduct && <RemoveProduct setOpenProduct={props.setOpenProduct} product={deleteProduct} close={setDeleteProduct}/> }
    </div>
  )
} 

//EDIT PRODUCT
type EditProductComponent = {
  product:IProducts,
  close:React.Dispatch<React.SetStateAction<IProducts|null>>,
  setOpenProduct:React.Dispatch<React.SetStateAction<IProducts|null>>
}
const EditProduct : React.FC<EditProductComponent> = (props) => {
  const [ error, setError ] = useState<null | string>(null)
  const [ productIdPlatform, setProductIdPlatform ] = useState(props.product.product_id_platform)
  const [ communityAccess, setCommunityAccess ] = useState(props.product.community_access)
  const [ name, setName ] = useState(props.product.name)
  const typeAccess = [
    {type:0,name:'Acesso Padrão'},
    {type:1,name:'Acesso a Comunidade'},
  ]
  const editProduct = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const data = {
        integration:props.product.integration,
        product_id_platform:productIdPlatform,
        community_access:communityAccess,
        name:name        
      }
     // console.log('data',data)
      const response = await api.patch(`editProduct/${props.product.id}`,data)
      if (response && response.data && response.data.success) {
        const infoProduto = await api.get(`infoProduct/${props.product.id}`)
        props.setOpenProduct(infoProduto.data.response)
        props.close(null)
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    } catch (err) {
      console.error('Erro ao obter os itens:', err);
    }
  }
  return(
    <Modal component={
      <form onSubmit={(e)=>editProduct(e)}>
        <TitleModal icon="faEdit" title="Editar Produto" close={()=>props.close(null)}/>
        <div className="flex flex-col p-4 mt-2 justify-center items-center">
          <div className="w-[350px]">
            <InputForm className="w-[350px]" required label={`Cód. do Produto no(a) ${props.product.integration}`} value={productIdPlatform} onChange={setProductIdPlatform} />
          </div>
          <div className="w-[350px]">
            <InputForm className="w-[350px]" required label="Nome" value={name} onChange={setName} />
          </div>
          <div className="w-full">
            <SelectForm className="mx-2 w-[350px]" label="Tipo de Acesso" options={typeAccess} lableKey='name' valueKey='type' value={communityAccess} onChange={setCommunityAccess}/>
          </div>
        </div>  
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-end border-t border-neutral-600 pt-2 mt-2">
          <Button btn="muted" name='Cancelar' type='notline' onClick={()=>props.close(null)} />
          <Button btn="success" icon="faFloppyDisk" name='Salvar Alterações' submit />
        </div>
      </form>}/>)
}

//REMOVE PRODUCT
type RemoveProductComponent = {
  product:IProducts,
  close:React.Dispatch<React.SetStateAction<IProducts|null>>,
  setOpenProduct:React.Dispatch<React.SetStateAction<IProducts|null>>
}
const RemoveProduct : React.FC<RemoveProductComponent> = (props) => {
  const [ error, setError ] = useState<null | string>(null)
  const removeProduct = async () => {
    try{
      const response = await api.patch(`editProduct/${props.product.id}`,{status:0})
      if (response && response.data && response.data.success) {
        props.setOpenProduct(null)
        props.close(null)
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    } catch (err) {
      console.error('Erro ao obter os itens:', err);
    }
  }

  
  return(    
    <Modal component={
      <div className="flex flex-col">
        <TitleModal icon="faTrash" title="Remover Produto" close={()=>props.close(null)}/>
        <p className="text-white p-4 font-light">
          Confirmar remoção do produto: <strong className="text-red-500 font-bold">({props.product.product_id_platform}) - {props.product.name}</strong>
        </p>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-end border-t border-neutral-600 pt-2 mt-2">
          <Button btn="muted" name='Cancelar' type='notline' onClick={()=>props.close(null)} />
          <Button btn="error" icon="faTrash" name='Sim, Remover' onClick={()=>removeProduct()} />
        </div>
      </div>}/>)
}