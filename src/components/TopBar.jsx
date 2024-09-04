import { BsArrowsFullscreen, BsWindow, BsWindowSplit, BsBorderAll } from "react-icons/bs"
import { TbColumns1, TbColumns2, TbColumns3 } from "react-icons/tb"
import { FaPause, FaPlay } from "react-icons/fa"

import { useEffect, useContext } from 'react'
import { ConfigContext } from '../contexts/ConfigContext'

export default function TopBar() {

  // console.log("TopBar")

  const { config, setConfig } = useContext(ConfigContext)

  const classButton = "size-9 md:size-[38px] inline-flex justify-center items-center gap-2 rounded-md font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs md:text-sm"
  const classButtonActive = "size-9 md:size-[38px] inline-flex justify-center items-center gap-2 rounded-md font-medium bg-blue-600 border border-gray-200 text-gray-50 hover:bg-blue-500 text-xs md:text-sm"

  useEffect(() => {
    localStorage.setItem('config', JSON.stringify({ showHeaderFooter: config.showHeaderFooter, quantityFrames: config.quantityFrames }))
  }, [config.showHeaderFooter, config.quantityFrames])

  const handleFullScreen = () => {
    setConfig({ ...config, showHeaderFooter: !config.showHeaderFooter })
  }

  const handleQuantityFrames = ({ quantity }) => {
    console.log("handleQuantityFrames", quantity)
    setConfig({ ...config, quantityFrames: quantity })
  }

  const startAllTimer = () => {
    // console.log("startAllTimer")
    setConfig({ ...config, isAllPlaying: true, framesWithImagesLoaded: [] })
  }

  const pauseAllTimer = () => {
    // console.log("pauseAllTimer")
    setConfig({ ...config, isAllPlaying: false, framesWithImagesLoaded: [] })
  }

  // console.log("config", config)

  return (
    <header className="flex justify-between items-center px-4 w-full h-16 bg-gray-100 border border-y-gray-300">
      <div className="lg:min-w-40">
        <button className={!config.showHeaderFooter ? classButtonActive : classButton} onClick={handleFullScreen} title="Exibir ou ocultar o cabeçalho e rodapé da página"><BsArrowsFullscreen /></button>
      </div>
      <div className="lg:min-w-40 lg:flex-grow text-center">
        <h2 className="text-xl font-medium">Previsão Numérica do Tempo</h2>
      </div>
      <div className="lg:min-w-40 flex gap-1">
        {config.isAllPlaying ? (
          <button className={classButtonActive} onClick={pauseAllTimer} title="Pausar a animação de todos os quadros"><FaPause /></button>
        ) : (
          <button className={classButton} onClick={startAllTimer} title="Iniciar animação de todos os quadros, desde o início"><FaPlay /></button>
        )}
        <button className={config.quantityFrames === 1 ? classButtonActive : classButton} onClick={() => handleQuantityFrames({ quantity: 1 })} title="Exibir 1 quadro"><TbColumns1 /></button>
        <button className={config.quantityFrames === 2 ? classButtonActive : classButton} onClick={() => handleQuantityFrames({ quantity: 2 })} title="Exibir 2 quadros"><TbColumns2 /></button>
        <button className={`${config.quantityFrames === 3 ? classButtonActive : classButton} hidden 2xl:inline-flex`} onClick={() => handleQuantityFrames({ quantity: 3 })} title="Exibir 3 quadros"><TbColumns3 /></button>
        <button className={config.quantityFrames === 4 ? classButtonActive : classButton} onClick={() => handleQuantityFrames({ quantity: 4 })} title="Exibir 4 quadros"><BsBorderAll /></button>
      </div>
    </header>
  )
}
