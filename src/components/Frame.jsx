import { useState } from 'react'
import PropTypes from 'prop-types'

import { useContext } from 'react'
import { ConfigContext } from '../contexts/Config'

import FrameTop from './FrameTop'
import FrameImage from './FrameImage'

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
    console.log("dateMinusTimeRun", dateMinusTimeRun)

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
