import { useState, useEffect, useContext } from 'react'

import { ConfigContext } from '../contexts/Config'

import { FaChevronLeft, FaChevronRight, FaClock, FaCog, FaPause, FaPlay } from 'react-icons/fa'

import DropDownConfig from './DropDownConfig'
import DropDownTime from './DropDownTime'

import { formatDate } from '../lib/formatDate'

export default function FrameTop({ frame, setFrame, model, setModel, dates }) {

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
    config.isAllPlaying ? startTimer() : pauseTimer()
  }, [config.isAllPlaying])

  const startTimer = () => {
    // console.log("startTimer")
    if (config.isAllPlaying) {
      clearInterval(timeInterval)
      setForecastTime(model.periodStart)
      setIsPlaying(true)
    }
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
    }, 1000))
  }

  const pauseTimer = () => {
    // console.log("pauseTimer")
    clearInterval(timeInterval)
    setFrame({ ...frame, isPlaying: false })
    setIsPlaying(false)
    setConfig({ ...config, isAllPlaying: false })
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

  return (
    <div className="flex justify-between">
      <div className="flex relative">
        <button className={openDropdownConfig ? classButtonActive : classButton} onClick={handleDropdownConfig} title="Configurações"><FaCog /></button>
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
          <button className={classButton} onClick={handleDecreaseTime} title="Voltar o tempo de previsão atual - forecast time"><FaChevronLeft /></button>
          {frame.isPlaying ? (
            <button className={classButtonActive} onClick={pauseTimer} title="Pausar"><FaPause /></button>
          ) : (
            <button className={classButton} onClick={startTimer} title="Iniciar animação do tempo de previsão"><FaPlay /></button>
          )}
          {/* <button className={classButton} onClick={() => resetTimer(hours[0])} title="Resetar">Resetar</button> */}
          <button className={classButton} onClick={handleIncreaseTime} title="Avançar o tempo de previsão atual - forecast time"><FaChevronRight /></button>
        </div>
        <div className="flex items-center">
          <div className="font-bold text-sm px-2 text-ellipsis overflow-hidden min-w-24" title="Tempo de previsão atual - forecast time">{forecastTime} horas</div>
          <button className={openDropdownTime ? classButtonActive : classButton} onClick={handleDropdownTime} title="Selecionar o tempo de previsão - forecast time"><FaClock /></button>
          {openDropdownTime && <DropDownTime forecastTime={forecastTime} setForecastTime={setForecastTime} frame={frame} setFrame={setFrame} hours={hours} />}
        </div>
      </div>
    </div>
  )
}
