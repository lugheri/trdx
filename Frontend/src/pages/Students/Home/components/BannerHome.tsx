import Logo from '/img/logo.png'

export const BannerHome = () => {
  return(
    <div className="flex justify-center items-end lg:items-center overflow-hidden mb-8 py-4
                    h-[15vh] lg:h-[25vh] 2xl:h-[30vh] 
    ">
      <img src={Logo} className="w-[30%] lg:w-[15%]"/>
    </div>
  )
}