import { BsArrowsFullscreen, BsBorderAll } from "react-icons/bs";
import { TbColumns1, TbColumns2, TbColumns3 } from "react-icons/tb";
import { FaPause, FaPlay } from "react-icons/fa";

import { useEffect, useContext, useState } from "react";
import { ConfigContext } from "../contexts/ConfigContext";

export default function TopBar() {
  const { config, frames, startAllTimer, pauseAllTimer, updateLocalConfig } =
    useContext(ConfigContext);
  const [showButtonAllPlaying, setShowButtonAllPlaying] = useState(true);

  const classButton =
    "size-9 md:size-[38px] inline-flex justify-center items-center gap-2 rounded-full font-medium text-gray-700 hover:bg-blue-200 text-xs md:text-sm";
  const classButtonActive =
    "size-9 md:size-[38px] inline-flex justify-center items-center gap-2 rounded-full font-medium bg-blue-600 text-gray-50 hover:bg-blue-500 text-xs md:text-sm";

  const handleFullScreen = () => {
    updateLocalConfig({
      ...config,
      showHeaderFooter: !config.showHeaderFooter,
    });
  };

  const handleQuantityFrames = ({ quantity }) => {
    updateLocalConfig({
      ...config,
      quantityFrames: quantity,
    });
  };

  useEffect(() => {
    const existsForecastTimeNull =
      frames.filter((frame) => frame.forecastTime === null).length > 0;
    setShowButtonAllPlaying(!existsForecastTimeNull);
  }, [frames]);

  return (
    <header className="flex justify-start md:justify-between items-center px-4 w-full h-16 bg-gray-100 border border-y-gray-300">
      <div className="lg:min-w-40">
        <button
          className={!config.showHeaderFooter ? classButtonActive : classButton}
          onClick={handleFullScreen}
          title="Exibir ou ocultar o cabeçalho e rodapé da página"
        >
          <BsArrowsFullscreen />
        </button>
      </div>
      <div className="w-full flex lg:flex-grow text-center justify-center">
        <h2 className="text-md md:text-xl font-medium">Previsão Numérica</h2>
      </div>
      <div className="flex gap-1">
        {showButtonAllPlaying && (
          <>
            {config.isAllPlaying ? (
              <button
                className={classButtonActive}
                onClick={pauseAllTimer}
                title="Pausar a animação de todos os quadros"
              >
                <FaPause />
              </button>
            ) : (
              <button
                className={classButton}
                onClick={startAllTimer}
                title="Iniciar animação de todos os quadros, desde o início, de forma sincronizada"
              >
                <FaPlay />
              </button>
            )}
          </>
        )}
        <button
          className={
            config.quantityFrames === 1 ? classButtonActive : classButton
          }
          onClick={() => handleQuantityFrames({ quantity: 1 })}
          title="Exibir 1 quadro na página"
        >
          <TbColumns1 />
        </button>
        <button
          className={
            config.quantityFrames === 2 ? classButtonActive : classButton
          }
          onClick={() => handleQuantityFrames({ quantity: 2 })}
          title="Exibir 2 quadros na página"
        >
          <TbColumns2 />
        </button>
        <button
          className={`${
            config.quantityFrames === 3 ? classButtonActive : classButton
          } hidden 2xl:inline-flex`}
          onClick={() => handleQuantityFrames({ quantity: 3 })}
          title="Exibir 3 quadros na página"
        >
          <TbColumns3 />
        </button>
        <button
          className={`${
            config.quantityFrames === 4 ? classButtonActive : classButton
          } hidden lg:inline-flex`}
          onClick={() => handleQuantityFrames({ quantity: 4 })}
          title="Exibir 4 quadros na página"
        >
          <BsBorderAll />
        </button>
      </div>
    </header>
  );
}
