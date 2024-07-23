import { BsArrowsFullscreen, BsWindow, BsWindowSplit, BsBorderAll } from "react-icons/bs"

import { useContext } from 'react'
import { ConfigContext } from '../contexts/Config'

export default function TopBar() {

  const classButton = "size-9 md:size-[38px] inline-flex justify-center items-center gap-2 rounded-md font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs md:text-sm"

  const classButtonActive = "size-9 md:size-[38px] inline-flex justify-center items-center gap-2 rounded-md font-medium bg-blue-700 border border-gray-200 text-gray-50 hover:bg-blue-600 text-xs md:text-sm"

  const { config, setConfig } = useContext(ConfigContext)

  const handleFullScreen = () => {
    if (config.showHeaderFooter) {
      setConfig({ ...config, showHeaderFooter: false })
    } else {
      setConfig({ ...config, showHeaderFooter: true })
    }
  }

  const handleQuantityFrames = ({ quantity }) => {
    console.log("handleQuantityFrames", quantity)
    setConfig({ ...config, quantityFrames: quantity })
  }

  // console.log("config", config)

  return (
    <header className="flex justify-between items-center px-4 w-full h-16 bg-gray-100 border border-y-gray-300">
      <div>
        <button className={config.showHeaderFooter ? classButton : classButtonActive} onClick={handleFullScreen}><BsArrowsFullscreen /></button>
      </div>
      <div>
        <h2 className="text-xl font-bold">Previsão Numérica do Tempo</h2>
      </div>
      <div className="flex gap-1">
        <button className={config.quantityFrames === 1 ? classButtonActive : classButton} onClick={() => handleQuantityFrames({ quantity: 1 })}><BsWindow /></button>
        <button className={config.quantityFrames === 2 ? classButtonActive : classButton} onClick={() => handleQuantityFrames({ quantity: 2 })}><BsWindowSplit /></button>
        <button className={config.quantityFrames === 4 ? classButtonActive : classButton} onClick={() => handleQuantityFrames({ quantity: 4 })}><BsBorderAll /></button>
      </div>
    </header>
  )
}
