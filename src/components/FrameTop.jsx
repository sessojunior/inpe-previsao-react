import { useState, useEffect, useContext } from 'react'
import { ConfigContext } from '../contexts/ConfigContext'
import { FaChevronLeft, FaChevronRight, FaClock, FaCog, FaPause, FaPlay, FaDownload } from 'react-icons/fa'
import DropDownConfig from './DropDownConfig'
import DropDownTime from './DropDownTime'
import { formatDate } from '../lib/formatDate'
import { toast } from 'react-toastify'

export default function FrameTop({ frame, setFrame, model, setModel, dates, loadingImages, setLoadingImages, downloadImageUrl }) {

  // console.log("FrameTop")
  // console.log("FrameTop dates", dates)

  const { config, setConfig, regions } = useContext(ConfigContext)

  const region = regions.find(region => region.value === frame.region)
  const group = model.options.groups.find(group => group.value === frame.group)
  const product = model.options.products.find(product => product.value === frame.product)

  // console.log("frame", frame)
  // console.log("model", model)
  // console.log("group", group)
  // console.log("product", product)

  // Cria um array de horas iniciando com model.periodStart (geralmente "000") e terminando com model.periodEnd (geralmente "180" ou "240")
  // Precisa ter 3 caracteres, e ficaria assim: ["000", "003", "006", ..., "240"]
  // O intervalo de horas é baseado em model.periodHours (geralmente 3 ou 6)
  const hours = Array.from({ length: (model.periodEnd - model.periodStart) / model.periodHours + 1 }, (_, i) => String(i * model.periodHours).padStart(3, '0'))

  const classButton = "size-9 md:size-[38px] inline-flex justify-center items-center gap-2 rounded-md font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs md:text-sm"
  const classButtonActive = "size-9 md:size-[38px] inline-flex justify-center items-center gap-2 rounded-md font-medium bg-blue-600 border border-gray-200 text-gray-50 hover:bg-blue-500 text-xs md:text-sm"

  const [openDropdownConfig, setOpenDropdownConfig] = useState(false)
  const [openDropdownTime, setOpenDropdownTime] = useState(false)

  const [forecastTime, setForecastTime] = useState(frame.forecastTime ?? model.periodStart)
  const [isPlaying, setIsPlaying] = useState(frame.isPlaying ?? false)

  const handleDropdownConfig = () => {
    setOpenDropdownConfig(!openDropdownConfig)
  }

  const handleDropdownTime = () => {
    setOpenDropdownTime(!openDropdownTime)
  }

  const handleDecreaseTime = () => {
    // console.log("decreaseTime")
    // console.log("frame.forecastTime", frame.forecastTime)
    // console.log("hours", hours)
    // console.log("hours.length", hours.length)
    if (hours.indexOf(forecastTime) > 0) {
      // console.log("hours[hours.indexOf(frame.forecastTime) - 1]", hours[hours.indexOf(frame.forecastTime) - 1])
      const previousTime = hours[hours.indexOf(forecastTime) - 1]
      // console.log("previousTime", previousTime)
      setForecastTime(previousTime)
      setFrame({ ...frame, forecastTime: previousTime })
    }
  }

  const handleIncreaseTime = () => {
    // console.log("increaseTime")
    // console.log("frame.forecastTime", frame.forecastTime)
    // console.log("hours", hours)
    // console.log("indexOf(frame.forecastTime)", hours.indexOf(frame.forecastTime))
    // console.log("hours.length", hours.length)
    if (hours.indexOf(forecastTime) < hours.length - 1) {
      // console.log("hours[hours.indexOf(frame.forecastTime) + 1]", hours[hours.indexOf(frame.forecastTime) + 1])
      const nextTime = hours[hours.indexOf(forecastTime) + 1]
      // console.log("nextTime", nextTime)
      setForecastTime(nextTime)
      setFrame({ ...frame, forecastTime: nextTime })
    }
  }

  {/* Begin Preload Images */ }

  function urlImage(forecastTime) {
    // console.log("forecastTime", forecastTime)
    const init = frame.init ?? dates[0]
    if (!init) return null

    const year = init?.slice(0, 4)
    const month = init?.slice(5, 7)
    const day = init?.slice(8, 10)
    const turn = init?.slice(11, 13)

    const url = model.urlImage.replaceAll("{{model}}", model.value)
      .replaceAll("{{region}}", frame.region)
      .replaceAll("{{product}}", frame.product)
      .replaceAll("{{forecastTime}}", forecastTime)
      .replaceAll("{{timeRun}}", model.timeRun)
      .replaceAll("{{turn}}", turn)
      .replaceAll("{{year}}", year)
      .replaceAll("{{month}}", month)
      .replaceAll("{{day}}", day)
    // console.log("url", url)
    return url
  }

  {/* End Preload Images */ }

  {/* Begin Timer */ }

  const [timer, setTimer] = useState(0)
  const [timeInterval, setTimeInterval] = useState(null)

  useEffect(() => {
    // console.log("forecastTime", forecastTime)
    if (timer > 0) {
      setFrame({ ...frame, forecastTime: forecastTime, isPlaying: isPlaying })
    }
  }, [timer])

  useEffect(() => {
    async function checkIsAllPlaying() {
      if (config.isAllPlaying) {
        // console.log("isAllPlaying")
        await preloadImages()
        if (config.isAllPlaying) {
          clearInterval(timeInterval)
          setForecastTime(model.periodStart)
          setIsPlaying(true)
          if (config.framesWithImagesLoaded.length === config.quantityFrames) {
            startAnimation()
          }
        }
      } else {
        pauseTimer()
      }
    }
    checkIsAllPlaying()
  }, [config.isAllPlaying])

  useEffect(() => {
    if (config.framesWithImagesLoaded.length === config.quantityFrames && config.quantityFrames > 1) {
      startAnimation()
      toast.success("Todas as imagens de animação dos quadros foram carregadas com sucesso!", { toastId: "allFramesLoaded" })
    }
  }, [config.framesWithImagesLoaded])

  function urlImage(forecastTime) {
    // console.log("forecastTime", forecastTime)
    const init = frame.init ?? dates[0]
    if (!init) return null
    const year = init?.slice(0, 4)
    const month = init?.slice(5, 7)
    const day = init?.slice(8, 10)
    const turn = init?.slice(11, 13)
    const url = model.urlImage.replaceAll("{{model}}", model.value)
      .replaceAll("{{region}}", frame.region)
      .replaceAll("{{product}}", frame.product)
      .replaceAll("{{forecastTime}}", forecastTime)
      .replaceAll("{{timeRun}}", model.timeRun)
      .replaceAll("{{turn}}", turn)
      .replaceAll("{{year}}", year)
      .replaceAll("{{month}}", month)
      .replaceAll("{{day}}", day)
    // console.log("url", url)
    return url
  }

  function saveImagesInCache(imageUrls) {
    const promises = imageUrls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = url
        img.onload = () => resolve(url)
        img.onerror = () => reject(new Error(`Erro ao carregar a imagem do frame ${frame.id}: ${url}`))
      })
    })
    return Promise.all(promises)
  }

  const preloadImages = async () => {
    setLoadingImages(true)
    let imageUrls = []
    if (frame.init !== undefined || dates.length > 0) {
      let imageUrls = hours.map((forecastTime) => urlImage(forecastTime))
      try {
        await saveImagesInCache(imageUrls)
        // console.log(`Imagens do frame ${frame.id} carregadas com sucesso!`)
        setConfig((prev) => ({
          ...prev, framesWithImagesLoaded: prev.framesWithImagesLoaded.includes(frame.id) ? prev.framesWithImagesLoaded : [...prev.framesWithImagesLoaded, frame.id]
        }))
      } catch (error) {
        console.error(`Erro ao pré-carregar as imagens do frame ${frame.id}:`, error)
      } finally {
        setLoadingImages(false)
      }
    }
  }

  const startAnimation = () => {
    clearInterval(timeInterval)
    setFrame({ ...frame, isPlaying: false })
    setIsPlaying(false)

    setTimeInterval(setInterval(() => {
      let ft = null
      setTimer((prev) => prev + 1)
      setForecastTime((prev) => {
        if (prev === hours[hours.length - 1]) {
          ft = hours[0]
          return ft
        } else {
          ft = hours[hours.indexOf(prev) + 1]
          return ft
        }
      })
      setIsPlaying(true)
      // console.log("forecastTime", forecastTime)
    }, 500))
  }

  const startTimer = async () => {
    // console.log("startTimer")
    //console.log("hours", hours)
    // console.log("frame.init", frame.init)
    // console.log("dates", dates)

    toast.warn(`Aguarde o carregamento das imagens do quadro ${frame.id} para iniciar a animação!`)
    await preloadImages()
    toast.success(`As imagens de animação do quadro ${frame.id} foram carregadas com sucesso!`)
    startAnimation()
  }

  const pauseTimer = () => {
    // console.log("pauseTimer")
    clearInterval(timeInterval)
    setFrame({ ...frame, isPlaying: false })
    setIsPlaying(false)
    setConfig({ ...config, isAllPlaying: false, framesWithImagesLoaded: [] })
  }

  const resetTimer = (time = null) => {
    // console.log("resetTimer")
    setTimer(0)
    pauseTimer()
    setForecastTime(time ?? model.periodStart)
    setIsPlaying(false)
    // console.log("model", model)
    // console.log("forecastTime", forecastTime)
    // console.log("frame", frame)
    // console.log("config", config)
  }

  {/* End Timer */ }

  const publicImage = "image-not-found.jpg"

  return (
    <div className="flex justify-between">
      <div className="flex relative">
        <button className={openDropdownConfig ? classButtonActive : classButton} onClick={handleDropdownConfig} title="Configurações do modelo, região e inicialização para este quadro"><FaCog /></button>
        {openDropdownConfig && <DropDownConfig frame={frame} setFrame={setFrame} model={model} setModel={setModel} dates={dates} resetTimer={resetTimer} />}
        <div className="mx-2">
          <div className="font-bold text-sm">{model.label} · {region?.label}</div>
          <div className="text-xs">
            {/* <span className={group.value !== model.value || group.value !== product.value ? "hidden" : ""}>{frame.init ? formatDate(frame.init) : dates.length > 0 ? formatDate(dates[0]) : "Data não definida"}</span> */}
            <span>
              {/* {group.value !== product.value ? (<>{product.label}</>) : (<>{group.label}</>)} */}
            </span>
            <span>{frame.init ? formatDate(frame.init) : dates.length > 0 ? formatDate(dates[0]) : "Data não definida"}</span>
          </div>
          <div className="text-xs">
          </div>
        </div>
      </div>
      <div className="flex relative">
        <div className="flex gap-1">
          <a href={downloadImageUrl} download="imagem-de-previsao.png" target="_blank" rel="noreferrer" className={classButton} title={`Abrir a imagem abaixo em uma nova aba do navegador, para fazer o download: ${downloadImageUrl}`}><FaDownload /></a>
          <button className={classButton} onClick={handleDecreaseTime} title="Voltar o tempo de previsão atual - forecast time"><FaChevronLeft /></button>
          {frame.isPlaying ? (
            <button className={classButtonActive} onClick={pauseTimer} title="Pausar"><FaPause /></button>
          ) : (
            <>
              {loadingImages ? (
                <button className={classButton} title="Carregando imagens...">
                  <span className="flex justify-center items-center">
                    <svg className="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                </button>
              ) : (
                <button className={classButton} onClick={startTimer} title="Iniciar animação do tempo de previsão"><FaPlay /></button>
              )}
            </>
          )}
          <button className={classButton} onClick={handleIncreaseTime} title="Avançar o tempo de previsão atual - forecast time"><FaChevronRight /></button>
        </div>
        <div className="flex items-center">
          <div key={forecastTime} className="font-bold text-sm px-2 text-ellipsis overflow-hidden min-w-24 text-center animate-bounce-in" title="Tempo de previsão atual - forecast time">{forecastTime} horas</div>
          <button className={openDropdownTime ? classButtonActive : classButton} onClick={handleDropdownTime} title="Selecionar o tempo de previsão - forecast time - para este quadro"><FaClock /></button>
          {openDropdownTime && <DropDownTime forecastTime={forecastTime} setForecastTime={setForecastTime} frame={frame} setFrame={setFrame} hours={hours} />}
        </div>
      </div>
    </div>
  )
}
