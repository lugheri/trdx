import { FormEvent, useEffect, useState } from "react";
import { Button } from "../../../../../components/Buttons";
import { Card } from "../../../../../components/Cards";
import { TitlePage } from "../../../../../components/Template/TitlePage";
import { IIntegrationPlatform, IProducts } from "../../Dtos/integrations.dto";

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProductSetup } from "./ProductsSetup";
import api from "../../../../../services/api";
import { LoadingBars } from "../../../../../components/Loading";
import { Modal, TitleModal } from "../../../../../components/Modal";
import { InputForm, SelectForm } from "../../../../../components/Inputs";

type SetupPlatformIntegrationComponent = {
  platform:IIntegrationPlatform;
  setOpenPlatform:React.Dispatch<React.SetStateAction<IIntegrationPlatform|null>>;
}
export const SetupPlatformIntegration : React.FC<SetupPlatformIntegrationComponent> = (props) => {
  const [ openProduct, setOpenProduct ] = useState<IProducts|null>(null)
  const [ products, setProducts ] = useState<null | IProducts[]>(null)
  const [ error, setError ] = useState<null | string>(null)
  const [ newProduct, setNewProduct ] = useState(false)
  const getProducts = async () => {
    try{
      const response = await api.get(`listProducts/${props.platform.name}/1`)
      if (response && response.data && response.data.success) {
        setProducts(response.data.response);
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    } catch (err) {
      console.error('Erro ao obter os itens:', err);
    }
  }
  useEffect(() => {getProducts();}, [ newProduct, openProduct]); 
  return(
    <div className="flex flex-col p-2">
      { openProduct 
      ?
        <ProductSetup openProduct={openProduct} setOpenProduct={setOpenProduct} />
      :
        <>
          <TitlePage
            icon="faWrench" 
            title={`Integração ${props.platform.name}`}
            description={`Configure os produtos da integração ${props.platform.name}!`}
            rightComponent={
              <Button submit btn="muted" icon="faReply" name='Voltar'  onClick={()=>props.setOpenPlatform(null)} />
            }/> 
          <Card component={
            <div className="flex w-full justify-between items-start">
              <div className="flex flex-col">
                <p className="text-neutral-100">
                  <FontAwesomeIcon className="text-teal-500/50" icon={Fas.faPlug}/> Dados da Integração:
                </p>
                <p className="text-neutral-50 font-light text-sm my-1"><b>Plataforma:</b> {props.platform.name}</p>
                <p className="text-neutral-50 font-light text-sm my-1"><b>Descrição:</b> {props.platform.description}</p>
                <p className="text-neutral-50 font-light text-sm my-1"><b>Link de Integração:</b> {props.platform.url}</p>
                {props.platform.ready === 1
                  ? <p className="text-teal-500 text-sm my-1"><b className="text-neutral-50">Status:</b> Disponível</p>
                  : <p className="text-red-500 text-sm my-1"><b className="text-neutral-50">Status:</b> Pendente</p>}
              </div>
              <Button btn="info" icon="faEdit" name="Editar Informações"/>         
            </div>
          }/>
          <Card component={
            <div className="flex flex-col w-full p-2">
              <div className="flex justify-between items-center">
                <div className="flex flex-col  ">
                  <p className="text-neutral-200">
                    <FontAwesomeIcon className="mr-2 text-teal-500/50" icon={Fas.faCartShopping}/> Produtos
                  </p>
                  <p className="text-neutral-200 text-sm font-light">
                    Cadastre os seus produtos desta integração
                  </p>
                </div>
                <Button
                  submit btn="success" icon="faCartPlus" name='Adicionar Produto'
                  onClick={()=>setNewProduct(true)} />
              </div>
              <div className="flex flex-col bg-neutral-800 p-2 rounded-md my-4">
                { error !== null ? <p className="text-red-500">{error}</p>
                : products === null ? <LoadingBars/>
                : products.length === 0 
                ? <div className="text-red-500 flex flex-col w-full p-4"> Nenhum Produto Cadastrado! </div> 
                : <div className="flex flex-wrap">
                    {products.map((product,key)=>
                      <Product key={key} product={product} setOpenProduct={setOpenProduct}/>)}              
                  </div>}
              </div>
              {newProduct && <NewProduct setNewProduct={setNewProduct} integration={props.platform.name}/>}
            </div>
          }/>
        </>}
    </div>)
}

//Product Item
type IProduct = {
  product:IProducts,
  setOpenProduct:React.Dispatch<React.SetStateAction<IProducts|null>>
}
const Product : React.FC<IProduct> = (props) => {
  return(
    <div className="flex flex-col justify-between items-center w-[19%] p-4 h-[280px] m-1 rounded relative
                    border bg-gray-800/50 hover:bg-gray-800 text-white border-teal-500">
      <div className="flex flex-col flex-1 justify-center items-center">
        <FontAwesomeIcon className="text-5xl text-teal-500/50" icon={Fas.faCartShopping}/>
        <p className="text-lg font-semibold text-white py-2">{props.product.product_id_platform}</p>
        <p className="text-white text-sm py-2 text-center">{props.product.name}</p>
        <p className="text-white text-sm font-light text-center">{props.product.community_access == 0 ? 'Acesso Padrão' : 'Acesso a Comunidade' }</p>
      </div>
      <div className="flex">
        <Button name="Configurar" icon="faWrench" size="sm" btn="success" onClick={()=>props.setOpenProduct(props.product)}/>
      </div>
    </div>    
  )
}

//NEW PRODUCT

type INewProduct = {
  integration:string,
  setNewProduct:React.Dispatch<React.SetStateAction<boolean>>  
}
const NewProduct : React.FC<INewProduct>  = (props) => {
  const [ error, setError ] = useState<null | string>(null)
  const [ productIdPlatform, setProductIdPlatform ] = useState("")
  const [ communityAccess, setCommunityAccess ] = useState('0')
  const [ name, setName ] = useState("")

  const typeAccess = [
    {type:0,name:'Acesso Padrão'},
    {type:1,name:'Acesso a Comunidade'},
  ]

  const SaveNewProduct = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const data = {
        integration:props.integration,
        product_id_platform:productIdPlatform,
        community_access:parseInt(communityAccess),
        name:name        
      }
      console.log('data',data)
      const response = await api.post('newProduct/',data)
      if (response && response.data && response.data.success) {
        props.setNewProduct(false)
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    } catch (err) {
      console.error('Erro ao obter os itens:', err);
    }
  }
  return(<Modal component={
    <form onSubmit={(e)=>SaveNewProduct(e)}>
      <TitleModal 
        icon='faCartPlus' close={()=>props.setNewProduct(false)} 
        title='Criar Novo Produto'/>

      <div className="flex flex-col p-4 mt-2 justify-center items-center">
        <div className="w-[350px]">
          <InputForm className="w-[350px]" required label={`Cód. do Produto no(a) ${props.integration}`} value={productIdPlatform} onChange={setProductIdPlatform} />
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
        <Button btn="muted" name='Cancelar' type='notline' onClick={()=>props.setNewProduct(false)} />
        <Button btn="info" icon="faCartPlus" name='Cadastrar Produto' submit />
      </div>
    </form>
  }/>)
}



