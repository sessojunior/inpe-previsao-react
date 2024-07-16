import { FaRegRectangleList, FaChevronLeft, FaPlay, FaPause, FaChevronRight, FaClock } from "react-icons/fa6"
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useContext } from 'react'
import { ConfigContext } from '../contexts/Config'

const FrameTop = ({ frame, setFrame, model, setModel, models }) => {
  
  const { config, setConfig } = useContext(ConfigContext)

  const classButton = "size-9 md:size-[38px] inline-flex justify-center items-center gap-2 rounded-md font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-50 text-xs md:text-sm"

  const classButtonTime = "size-9 md:size-[38px] inline-flex justify-center items-center gap-2 rounded-md font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-50 text-xs md:text-sm"

  const classButtonTimeActive = "size-9 md:size-[38px] inline-flex justify-center items-center gap-2 rounded-md font-medium bg-blue-700 border border-gray-200 text-gray-50 focus:outline-none focus:bg-gray-50 text-xs md:text-sm"

  const [openDropdownConfig, setOpenDropdownConfig] = useState(false)
  const [openDropdownTime, setOpenDropdownTime] = useState(false)

  const handleDropdownConfig = () => {
    setOpenDropdownConfig(!openDropdownConfig)
  }

  const handleDropdownTime = () => {
    setOpenDropdownTime(!openDropdownTime)
  }

  const handleDecreaseTime = () => {
    // console.log("decreaseTime")
    // console.log("frame.currentTime", frame.currentTime)
    // console.log("model.possibleValues.time", model.possibleValues.time)
    // console.log("indexOf(model.currentTime)", model.possibleValues.time.indexOf(frame.currentTime))
    // console.log("model.possibleValues.time.length", model.possibleValues.time.length)
    if (model.possibleValues.time.indexOf(frame.currentTime) > 0) {
      // console.log("model.possibleValues.time[model.possibleValues.time.indexOf(frame.currentTime) - 1]", model.possibleValues.time[model.possibleValues.time.indexOf(frame.currentTime) - 1])
      const previousTime = model.possibleValues.time[model.possibleValues.time.indexOf(frame.currentTime) - 1]
      // console.log("previousTime", previousTime)
      setFrame({ ...frame, currentTime: previousTime })
    }
  }

  const handleIncreaseTime = () => {
    // console.log("increaseTime")
    // console.log("frame.currentTime", frame.currentTime)
    // console.log("model.possibleValues.time", model.possibleValues.time)
    // console.log("indexOf(frame.currentTime)", model.possibleValues.time.indexOf(frame.currentTime))
    // console.log("model.possibleValues.time.length", model.possibleValues.time.length)
    if (model.possibleValues.time.indexOf(frame.currentTime) < model.possibleValues.time.length - 1) {
      // console.log("model.possibleValues.time[model.possibleValues.time.indexOf(frame.currentTime) + 1]", model.possibleValues.time[model.possibleValues.time.indexOf(frame.currentTime) + 1])
      const nextTime = model.possibleValues.time[model.possibleValues.time.indexOf(frame.currentTime) + 1]
      // console.log("nextTime", nextTime)
      setFrame({ ...frame, currentTime: nextTime })
    }
  }

  {/* Begin Timer */ }

  // Initialize state variables for timer and timeInterval
  const [timer, setTimer] = useState(0);
  const [timeInterval, setTimeInterval] = useState(null);
  const [currentTime, setCurrentTime] = useState(model.possibleValues.time[model.possibleValues.time.indexOf(frame.currentTime)])

  useEffect(() => {
    // console.log("currentTime", currentTime)
    if (timer > 0) {
      setFrame({ ...frame, currentTime: currentTime })
    }
  }, [timer])

  useEffect(() => {
    const index = frame.id - 1
    // console.log("index", index)
    // console.log("frame", frame)
    // console.log("config.frames", config.frames)

    setConfig({ ...config, frames: [...config.frames.slice(0, index), { ...frame, isPlaying: false }, ...config.frames.slice(index + 1)] })
    console.log("mudou config")
    // localStorage.setItem('frames', JSON.stringify(config.frames))
  }, [frame])

  useEffect(() => {
    console.log("config.frames", config.frames)
    localStorage.setItem('frames', JSON.stringify(config.frames))
    console.log("salvou no localStorage")
  }, [config.frames])

  // Function to start the timer
  const startTimer = () => {
    // Use setInterval to update the timer every 1000 milliseconds (1 second)
    setTimeInterval(setInterval(() => {
      // Update the timer by incrementing the previous value by 1
      setTimer((prev) => prev + 1)
      setCurrentTime((prev) => {
        if (prev === model.possibleValues.time[model.possibleValues.time.length - 1]) {
          return model.possibleValues.time[0]
        } else {
          return model.possibleValues.time[model.possibleValues.time.indexOf(prev) + 1]
        }
      })
      setFrame({ ...frame, isPlaying: true })
    }, 1000))
  }

  // Function to pause the timer
  const pauseTimer = () => {
    // Clear the interval to stop the timer from updating
    clearInterval(timeInterval)
    setFrame({ ...frame, isPlaying: false })
  }

  // Function to reset the timer
  // const resetTimer = () => {
  //   // Reset the timer value to 0
  //   setTimer(0)
  //   setFrame({ ...frame, isPlaying: true, currentTime: model.possibleValues.time[0] })
  //   // Clear the interval to stop the timer
  //   clearInterval(timeInterval)
  // }

  {/* End Timer */ }
  
  const handleChangeModel = (e) => {
    const model = models.find(model => model.value === e.target.value)
    setModel(model)
    setFrame({
      ...frame,
      model: e.target.value,
      region: model.defaultValues.region.value,
      options: model.defaultValues.options.value,
      field: model.defaultValues.field.value,
      init: model.defaultValues.init,
      timeRun: model.defaultValues.timeRun,
      currentTime: model.defaultValues.currentTime,
    })
    // console.log("handleChangeModel (model)", model)
    // console.log("handleChangeModel (frame)", frame)
    // console.log("frame.region", frame.region)
    // console.log("model.possibleValues.region", model.possibleValues.region.find(region => region.value === frame.region))
    // console.log("model.possibleValues.region.find", model.possibleValues.region.find(region => region.value === frame.region))
  }

  const handleChangeRegion = (e) => {
    setFrame({ ...frame, region: e.target.value })
  }

  const handleChangeOptions = (e) => {
    setFrame({ ...frame, options: e.target.value })
  }

  const handleChangeField = (e) => {
    setFrame({ ...frame, field: e.target.value })
  }

  const handleChangeInit = (e) => {
    setFrame({ ...frame, init: e.target.value })
  }

  // console.log("frames", frames)
  // console.log("possibleValues", model.possibleValues)
  // console.log("possibleValues.model", model.possibleValues.model)
  // console.log("id", id)
  // console.log("TopFrame (frame)", frame)

  const DropDownConfig = () => {
    return (
      <>
        <form>
            <div className="absolute top-12 left-0 bg-gray-100 border border-gray-200 rounded-md p-4">
              <div className="border-b border-gray-200">
                <div>
                  <label>Modelo e região</label>
                  <select name="model" value={frame.model} onChange={e => handleChangeModel(e)}>
                    {models.map((model, index) => (
                      <option key={index} value={model.value}>{model.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select name="region" value={frame.region} onChange={e => handleChangeRegion(e)}>
                    {model.possibleValues.region.map((region, index) => (
                      <option key={index} value={region.value}>Região {region.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="border-b border-gray-200">
                <div>
                  <label>Características do modelo</label>
                  {model.possibleValues.options.map((option, index) => (
                    <div key={index}>
                      <input type="radio" name="options" value={option.value} onChange={e => handleChangeOptions(e)} defaultChecked={frame.options === option.value} /> {option.label}
                    </div>
                  ))}
                  <select name="field" value={frame.field} onChange={e => handleChangeField(e)}>
                    {model.possibleValues.field.map((field, index) => (
                      <option key={index} value={field.value}>{field.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <div>
                  <label htmlFor="init">Inicialização</label>
                  <select name="init" value={frame.init} onChange={e => handleChangeInit(e)}>
                    {model.possibleValues.init.map((init, index) => (
                      <option key={index} value={init}>{init}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </form>
      </>
    )
  }

  const DropDownTime = () => {
    return (
      <>
        <div className="absolute top-12 right-0 bg-gray-100 border border-gray-200 rounded-md p-4">
          <div>
            <label>Horas de previsão</label>
            <div>
              {model.possibleValues.time.map((time, index) => (
                <button key={index} className={frame.currentTime === time ? classButtonTimeActive : classButtonTime} onClick={() => setFrame({ ...frame, currentTime: time })}>{time}</button>
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="flex justify-between">
      <div className="flex relative">
        <button className={classButton} onClick={handleDropdownConfig}><FaRegRectangleList /></button>
        {openDropdownConfig && <DropDownConfig />}
        <div className="mx-2">
          <div className="font-bold text-sm">{/* {frame.model} */} {model.label} {">"} Região {/* {frame.region} */} {model.possibleValues.region.find(region => region.value === frame.region).label}
          </div>
          <div className="text-xs">{frame.init}</div>
        </div>
      </div>
      <div className="flex relative">
        <div className="flex gap-1">
          <button className={classButton} onClick={handleDecreaseTime}><FaChevronLeft /></button>
          {frame.isPlaying ? (
            <button className={classButton} onClick={pauseTimer}><FaPause /></button>
          ) : (
            <button className={classButton} onClick={startTimer}><FaPlay /></button>
          )}
          {/* <button className={classButton} onClick={resetTimer}>Reset</button> */}
          <button className={classButton} onClick={handleIncreaseTime}><FaChevronRight /></button>
        </div>
        <div className="flex items-center">
          <div className="font-bold text-sm px-2">{frame.currentTime} horas</div>
          <button className={classButton} onClick={handleDropdownTime}><FaClock /></button>
          {openDropdownTime && <DropDownTime />}
        </div>
      </div>
    </div>
  )
}

const FrameImage = ({ frame, model, date }) => {

  // console.log(frames, id)
  // console.log("frame", frame)

  return (
    <div>
      <p>Exemplo de URL da imagem:
        <br />[https://s1.cptec.inpe.br/grafico/Modelos/<b>{frame.model}</b>/<b>{frame.region}</b>/<b>{frame.options}</b>/<b>{frame.field}</b>
        <br />/<b>{date.yearMinusTimeRun}</b>/<b>{date.monthMinusTimeRun}</b>/<b>{date.dayMinusTimeRun}</b>/<b>{date.lastTurn}</b>/modelo_<b>{frame.currentTime}</b>_<b>{Number(date.timeRun)}</b>h_glo_<b>{date.yearMinusTimeRun}{date.monthMinusTimeRun}{date.dayMinusTimeRun}{date.lastTurn}</b>Z.png]</p>
      <p>Dados para a troca de imagem:</p>
      <p>[frame.model: <b>{frame.model}</b>]</p>
      <p>[frame.region: <b>{frame.region}</b>]</p>
      <p>[frame.options: <b>{frame.options}</b>]</p>
      <p>[frame.field: <b>{frame.field}</b>]</p>
      <p>[model.possibleValues.time: <b>{model.possibleValues.time.map(time => time + " ")}</b>]</p>
      <p><b>[frame.currentTime: <b>{frame.currentTime}</b>]</b></p>
      <p>[frame.isPlaying: <b>{frame.isPlaying ? "true" : "false"}</b>]</p>
      <p>[frame.timeRun: <b>{frame.timeRun}</b>]</p>
      <p>[frame.init: <b>{frame.init}</b>]</p>
      <p>Data atual: <b>{date.year}-{date.month}-{date.day} {date.hour}:{date.minute}:{date.second} - {date.weekName} {date.day} {date.monthName} {date.year}</b></p>
      <p>[timeRun: <b>{date.timeRun}</b>]</p>
      <p>Data menos o timeRun: <b>{date.yearMinusTimeRun} {date.monthMinusTimeRun} {date.dayMinusTimeRun} {date.hourMinusTimeRun}:{date.minuteMinusTimeRun}:{date.secondMinusTimeRun}</b></p>
      <p>[lastTurn: <b>{date.lastTurn}</b>]</p>
      <p>Último turno de timeRun (00, 06, 12, 18]: <b>{date.yearMinusTimeRun}{date.monthMinusTimeRun}{date.dayMinusTimeRun}<u>{date.lastTurn}</u>Z</b></p>
      <img src="https://s1.cptec.inpe.br/grafico/Modelos/SMNA/figuras/precipitacao/2024/07/11/00/prec_6h_glo_2024071100Z_2024071100Z.png" alt="imagem" className="rounded-md mt-4 w-full " />
    </div>
  )
}

export default function Frame({ id }) {
  
  const { config } = useContext(ConfigContext)

  const [frame, setFrame] = useState(config.frames.find(frame => frame.id === id))
  // console.log("Frame (id, frame)", id, frame)

  // console.log("frame.model", frame.model)
  // console.log("config.models", config.models)

  const [model, setModel] = useState(config.models.find(model => model.value === frame.model))
  // console.log("model", model)

  let classFrame = ""
  if (config.quantityFrames === 1) {
    classFrame = "flex flex-col border-l border-r border-gray-r-300 border-gray-l-300 p-4"
  } else {
    classFrame = "flex flex-col border-r border-b border-gray-r-300 p-4"
  }

  {/* Start tests with date */ }
  const dateTime = (date, timeRun) => {
    const year = String(date.getFullYear())
    const month = ("0" + (date.getMonth() + 1)).slice(-2)
    const day = ("0" + date.getDate()).slice(-2)
    const hour = ("0" + (date.getHours() + 1)).slice(-2)
    const minute = ("0" + (date.getMinutes() + 1)).slice(-2)
    const second = ("0" + (date.getSeconds() + 1)).slice(-2)
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
    const weekName = weekdays[date.getDay()]
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const monthName = months[date.getMonth()]
    console.log("year, month, day, hour, minute, second, weekName, monthName, timeRun", year, month, day, hour, minute, second, weekName, monthName, timeRun)

    const dateMinusTimeRun = new Date(new Date().getTime() - ((timeRun * 60 * 60) * 1000))
    const yearMinusTimeRun = String(dateMinusTimeRun.getFullYear())
    const monthMinusTimeRun = ("0" + (dateMinusTimeRun.getMonth() + 1)).slice(-2)
    const dayMinusTimeRun = ("0" + dateMinusTimeRun.getDate()).slice(-2)
    const hourMinusTimeRun = ("0" + (dateMinusTimeRun.getHours() + 1)).slice(-2)
    const minuteMinusTimeRun = ("0" + (dateMinusTimeRun.getMinutes() + 1)).slice(-2)
    const secondMinusTimeRun = ("0" + (dateMinusTimeRun.getSeconds() + 1)).slice(-2)
    console.log(dateMinusTimeRun)

    let lastTurn = null
    switch (timeRun) {
      case "06":
        if (Number(hourMinusTimeRun) < 6) {
          lastTurn = "00"
        } else if (Number(hourMinusTimeRun) >= 6 && Number(hourMinusTimeRun) < 12) {
          lastTurn = "06"
        } else if (Number(hourMinusTimeRun) >= 12 && Number(hourMinusTimeRun) < 18) {
          lastTurn = "12"
        } else {
          lastTurn = "18"
        }
        break;
      case "12":
        if (Number(hourMinusTimeRun) < 12) {
          lastTurn = "00"
        } else {
          lastTurn = "12"
        }
        break;
      default:
        lastTurn = "00"
    }
    console.log("lastTurn", lastTurn)

    return { date, year, month, day, hour, minute, second, weekName, monthName, timeRun, yearMinusTimeRun, monthMinusTimeRun, dayMinusTimeRun, hourMinusTimeRun, minuteMinusTimeRun, secondMinusTimeRun, lastTurn }
  }
  {/* End tests with date */ }
  
  const date = dateTime(new Date(), frame.timeRun)
  console.log("frame.timeRun", frame.timeRun)
  console.log("date", date)

  return (
    <div className={classFrame}>
      <FrameTop frame={frame} setFrame={setFrame} model={model} setModel={setModel} models={config.models} />
      <FrameImage frame={frame} model={model} date={date} />
    </div>
  )
}

Frame.propTypes = {
  id: PropTypes.number,
  frames: PropTypes.array,
  models: PropTypes.array,
}

FrameTop.propTypes = {
  frame: PropTypes.object,
  setFrame: PropTypes.func,
  model: PropTypes.object,
  setModel: PropTypes.func,
  models: PropTypes.array,
}

FrameImage.propTypes = {
  frame: PropTypes.object,
  model: PropTypes.object,
  date: PropTypes.object,
}
