import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { ConfigContext } from "../contexts/ConfigContext";
import {
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaCog,
  FaPause,
  FaPlay,
  FaDownload,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import DropDownConfig from "./DropDownConfig";
import DropDownTime from "./DropDownTime";
import { formatDate } from "../lib/formatDate";
import { toast } from "react-toastify";

import ImageNotFound from "../assets/not-found.png";

export default function FrameTop({
  frame,
  setFrame,
  model,
  setModel,
  dates,
  loadingImages,
  setLoadingImages,
  downloadImageUrl,
}) {
  const {
    config,
    setConfig,
    regions,
    startAllTimer,
    pauseAllTimer,
    updateLocalConfig,
  } = useContext(ConfigContext);

  const region = regions.find((region) => region.value === frame.region);
  const group = model.options.groups.find(
    (group) => group.value === frame.group
  );
  const product =
    model.options.products.find((product) => product.value === frame.product) ||
    model.options.products[0];

  // Se o intervalo de horas for específico para o produto, por exemplo, um produto que só roda de 24 em 24 horas, obtém a partir do produto o período de horas que o mesmo roda.
  const periodHours = product.periodHours ?? model.periodHours;

  // Se o período que inicia ou termina for específico para o produto, por exemplo, um produto que inicia em "024", obtém a partir do produto o período de horas que o mesmo roda.
  const periodStart = product.periodStart ?? model.periodStart;
  const periodEnd = product.periodEnd ?? model.periodEnd;

  // Cria um array de horas iniciando com model.periodStart (geralmente "000") e terminando com model.periodEnd (geralmente "180" ou "240")
  // Precisa ter 3 caracteres, e ficaria assim: ["000", "003", "006", ..., "240"]
  // O intervalo de horas é baseado em periodHours (geralmente 3 ou 6 quando baseado em model ou 24 quando baseado em product)

  // Cálculo da quantidade de intervalos
  const length =
    Math.floor((Number(periodEnd) - Number(periodStart)) / periodHours) + 1;

  // Gerar o array de horas, formatando corretamente os valores, incluindo "000"
  const hours = Array.from({ length }, (_, i) => {
    const value = Number(periodStart) + i * periodHours;

    // Formatar com 3 dígitos e tratar "000" como valor padrão, além de positivo/negativo
    return value === 0
      ? "000"
      : (value > 0 ? "" : "-") + String(Math.abs(value)).padStart(3, "0");
  });

  //console.log(hours);

  const classButton =
    "size-9 md:size-[38px] inline-flex justify-center items-center gap-2 rounded-full font-medium text-gray-700 hover:bg-blue-100 text-xs md:text-sm";
  const classButtonActive =
    "size-9 md:size-[38px] inline-flex justify-center items-center gap-2 rounded-full font-medium bg-blue-600 text-gray-50 hover:bg-blue-500 text-xs md:text-sm";

  const [openDropdownConfig, setOpenDropdownConfig] = useState(false);
  const [openDropdownTime, setOpenDropdownTime] = useState(false);

  const [forecastTime, setForecastTime] = useState(
    product.forecastTime ?? model.forecastTime ?? periodStart
  );
  const [isPlaying, setIsPlaying] = useState(frame.isPlaying ?? false);

  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleDropdownConfig = useCallback(() => {
    setOpenDropdownConfig((prev) => !prev);
    setOpenDropdownTime(false);
  }, []);

  const handleDropdownTime = useCallback(() => {
    setOpenDropdownTime((prev) => !prev);
    setOpenDropdownConfig(false);
  }, []);

  const handleDecreaseTime = useCallback(() => {
    if (hours.indexOf(forecastTime) > 0) {
      const previousTime = hours[hours.indexOf(forecastTime) - 1];
      setForecastTime(previousTime);
      setFrame({ ...frame, forecastTime: previousTime });
    }
  }, [forecastTime, hours, frame, setFrame]);

  const handleIncreaseTime = useCallback(() => {
    if (hours.indexOf(forecastTime) < hours.length - 1) {
      const nextTime = hours[hours.indexOf(forecastTime) + 1];
      setForecastTime(nextTime);
      setFrame({ ...frame, forecastTime: nextTime });
    }
  }, [forecastTime, hours, frame, setFrame]);

  {
    /* Begin Timer */
  }

  const [timer, setTimer] = useState(0);
  const [timeInterval, setTimeInterval] = useState(null);

  useEffect(() => {
    if (timer > 0) {
      setFrame({ ...frame, forecastTime: forecastTime, isPlaying: isPlaying });
    }
  }, [timer]);

  useEffect(() => {
    async function checkIsAllPlaying() {
      if (config.isAllPlaying) {
        await preloadImages();
        if (config.isAllPlaying) {
          clearInterval(timeInterval);
          setForecastTime(periodStart);
          setIsPlaying(true);
          if (config.framesWithImagesLoaded.length === config.quantityFrames) {
            startAnimation();
          }
        }
      } else {
        pauseTimer();
      }
    }
    checkIsAllPlaying();
  }, [config.isAllPlaying]);

  useEffect(() => {
    if (
      config.framesWithImagesLoaded.length === config.quantityFrames &&
      config.quantityFrames > 1
    ) {
      startAnimation();
      toast.success(
        "Todas as imagens de animação dos quadros foram carregadas com sucesso!",
        { toastId: "allFramesLoaded" }
      );
    }
  }, [config.framesWithImagesLoaded]);

  const urlImage = useCallback(
    (forecastTime) => {
      const init = frame.init ?? dates[0];
      if (!init) return null;
      const year = init?.slice(0, 4);
      const month = init?.slice(5, 7);
      const day = init?.slice(8, 10);
      const turn = init?.slice(11, 13);
      const url = model.urlImage
        .replaceAll("{{model}}", model.value)
        .replaceAll("{{region}}", frame.region)
        .replaceAll("{{product}}", frame.product)
        .replaceAll("{{forecastTime}}", forecastTime)
        .replaceAll("{{timeRun}}", model.timeRun)
        .replaceAll("{{turn}}", turn)
        .replaceAll("{{year}}", year)
        .replaceAll("{{month}}", month)
        .replaceAll("{{day}}", day);
      return url;
    },
    [frame.init, dates, frame.region, frame.product, model]
  );

  function saveImagesInCache(imageUrls) {
    const promises = imageUrls.map((url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(url);
        img.onerror = () =>
          reject(
            new Error(`Erro ao carregar a imagem do frame ${frame.id}: ${url}`)
          );
      });
    });
    return Promise.all(promises);
  }

  const preloadImages = async () => {
    setLoadingImages(true);
    let imageUrls = [];
    if (frame.init !== undefined || dates.length > 0) {
      let imageUrls = hours.map((forecastTime) => urlImage(forecastTime));
      try {
        await saveImagesInCache(imageUrls);
        setConfig((prev) => ({
          ...prev,
          framesWithImagesLoaded: prev.framesWithImagesLoaded.includes(frame.id)
            ? prev.framesWithImagesLoaded
            : [...prev.framesWithImagesLoaded, frame.id],
        }));
      } catch (error) {
        console.error(
          `Erro ao pré-carregar as imagens do frame ${frame.id}:`,
          error
        );
      } finally {
        setLoadingImages(false);
      }
    }
  };

  const startAnimation = () => {
    clearInterval(timeInterval);
    setFrame({ ...frame, isPlaying: false });
    setIsPlaying(false);

    setTimeInterval(
      setInterval(() => {
        let ft = null;
        setTimer((prev) => prev + 1);
        setForecastTime((prev) => {
          if (prev === hours[hours.length - 1]) {
            ft = hours[0];
            return ft;
          } else {
            ft = hours[hours.indexOf(prev) + 1];
            return ft;
          }
        });
        setIsPlaying(true);
      }, 500)
    );
  };

  const startTimer = useCallback(async () => {
    toast.warn(
      `Aguarde o carregamento das imagens do quadro ${frame.id} para iniciar a animação!`
    );
    await preloadImages();
    toast.success(
      `As imagens de animação do quadro ${frame.id} foram carregadas com sucesso!`
    );
    startAnimation();
  }, [frame.id, preloadImages, startAnimation]);

  const pauseTimer = () => {
    clearInterval(timeInterval);
    setFrame({ ...frame, isPlaying: false });
    setIsPlaying(false);
    updateLocalConfig({
      ...config,
      isAllPlaying: false,
      framesWithImagesLoaded: [],
    });
  };

  const resetTimer = (time = null) => {
    setTimer(0);
    pauseTimer();
    setForecastTime(time ?? forecastTime);
    setIsPlaying(false);
  };

  {
    /* End Timer */
  }

  // Capturar eventos de teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.isContentEditable);

      if (isInputFocused) {
        return; // Não processa as teclas se um input estiver focado
      }

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          handleDecreaseTime();
          break;
        case "ArrowRight":
          event.preventDefault();
          handleIncreaseTime();
          break;
        case " ":
        case "Spacebar": // Para compatibilidade com navegadores antigos
          event.preventDefault();
          if (isPlaying) {
            pauseAllTimer();
          } else {
            startAllTimer();
          }
          break;
        case "p":
        case "P":
          event.preventDefault();
          if (isPlaying) {
            pauseAllTimer();
          } else {
            startAllTimer();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup: remove o event listener ao desmontar o componente
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    handleDecreaseTime,
    handleIncreaseTime,
    isPlaying,
    pauseTimer,
    startTimer,
  ]);

  const publicImage = ImageNotFound;

  return (
    <div className="flex justify-between">
      <div className="flex relative">
        {openDropdownConfig ? (
          <button
            className={classButtonActive}
            title="Clique aqui para fechar"
            onClick={handleDropdownConfig}
          >
            <IoClose size={24} />
          </button>
        ) : (
          <button
            className={classButton}
            title="Clique aqui para alterar as configurações"
            onClick={handleDropdownConfig}
          >
            <FaCog size={20} />
          </button>
        )}
        {openDropdownConfig && (
          <DropDownConfig
            frame={frame}
            setFrame={setFrame}
            model={model}
            setModel={setModel}
            periodStart={periodStart}
            dates={dates}
            resetTimer={resetTimer}
            isInputFocused={isInputFocused}
            setIsInputFocused={setIsInputFocused}
          />
        )}
        <div className="mx-2 hidden sm:block">
          <div className="font-bold text-sm">
            {model.label}{" "}
            {/* <span className="hidden 2xl:inline-block"> · {region?.label}</span> */}
          </div>
          <div className="text-xs">
            {/* <span className={group.value !== model.value || group.value !== product.value ? "hidden" : ""}>{frame.init ? formatDate(frame.init) : dates.length > 0 ? formatDate(dates[0]) : "Data não definida"}</span> */}
            <span>
              {/* {group.value !== product.value ? (<>{product.label}</>) : (<>{group.label}</>)} */}
            </span>
            <span>
              {frame.init
                ? formatDate(frame.init)
                : dates.length > 0
                ? formatDate(dates[0])
                : "Data não definida"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex relative">
        <div className="flex gap-1">
          {frame.forecastTime !== null && (
            <>
              <a
                href={downloadImageUrl}
                download="imagem-de-previsao.png"
                target="_blank"
                rel="noreferrer"
                className={classButton}
                title={`Abrir a imagem abaixo em uma nova aba do navegador, para fazer o download: ${downloadImageUrl}`}
              >
                <FaDownload />
              </a>
              <button
                className={classButton}
                onClick={handleDecreaseTime}
                title="Voltar o tempo de previsão atual (Tecla de seta esquerda)"
              >
                <FaChevronLeft />
              </button>
              {frame.isPlaying ? (
                <button
                  className={classButtonActive}
                  onClick={pauseTimer}
                  title="Pausar"
                >
                  <FaPause />
                </button>
              ) : (
                <>
                  {loadingImages ? (
                    <button
                      className={classButton}
                      title="Carregando imagens..."
                    >
                      <span className="flex justify-center items-center">
                        <svg
                          className="animate-spin h-5 w-5 text-red-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </span>
                    </button>
                  ) : (
                    <button
                      className={classButton}
                      onClick={startTimer}
                      title="Iniciar animação do tempo de previsão"
                    >
                      <FaPlay />
                    </button>
                  )}
                </>
              )}
              <button
                className={classButton}
                onClick={handleIncreaseTime}
                title="Avançar o tempo de previsão atual (Tecla de seta direito)"
              >
                <FaChevronRight />
              </button>
            </>
          )}
        </div>
        {frame.forecastTime !== null && (
          <>
            <div className="flex items-center">
              <div
                key={forecastTime}
                className="font-bold text-sm text-ellipsis overflow-hidden min-w-16 text-center animate-bounce-in"
                title="Tempo de previsão atual"
              >
                <span>
                  {Number(forecastTime)}
                  <small>h</small>
                </span>
              </div>
              {openDropdownTime ? (
                <button
                  className={classButtonActive}
                  title="Clique aqui para fechar"
                  onClick={handleDropdownTime}
                >
                  <IoClose size={24} />
                </button>
              ) : (
                <button
                  className={classButton}
                  title="Clique aqui para selecionar o tempo (forecast) de previsão"
                  onClick={handleDropdownTime}
                >
                  <FaClock size={20} />
                </button>
              )}
              {openDropdownTime && (
                <DropDownTime
                  forecastTime={forecastTime}
                  setForecastTime={setForecastTime}
                  frame={frame}
                  setFrame={setFrame}
                  hours={hours}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
