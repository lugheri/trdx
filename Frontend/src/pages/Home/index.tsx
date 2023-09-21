import Banner from '/img/banner-home-2.png'
import { Card } from '../../components/Cards';

export const Home = () => {
  return(
    <div className="flex flex-col items-center py-2 p-4">    
      <div className="w-full h-[275px] rounded-t-3xl relative overflow-hidden">
        <img src={Banner} className="w-full my-2 rounded-t-3xl absolute"/> 
        <div className="bg-gradient-to-b from-transparent via-transparent to-[#070707] w-full flex absolute z-10 absolute h-full">
        </div>
      </div>
      
      
      
      <Card className="w-full mx-4" component={
        <div className="flex w-full">
          <div className="flex-1">
            Info
          </div>
          <div className="flex-1">
            Texto
          </div>
        </div>
      }/>
      <Card className="w-full mx-4" component={<div>
        <p className="text-slate-600 dark:text-slate-300 font-bold">Continue de onde parou</p>
      </div>}/>
      
      <Card className="w-full mx-4" component={<div>
        <p className="text-slate-600 dark:text-slate-300 font-bold">Escolha o curso que deseja assistir</p>
        </div>}/>
    </div>
  )
}