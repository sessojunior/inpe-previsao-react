import { useState, createContext } from 'react'
import PropTypes from 'prop-types'

import jsonModels from '../data/models.json'
import jsonFrames from '../data/frames.json'

export const ConfigContext = createContext({})

export default function ConfigProvider({ children }) {

  const [config, setConfig] = useState({
    showHeaderFooter: JSON.parse(localStorage.getItem('config'))?.showHeaderFooter ?? true,
    quantityFrames: JSON.parse(localStorage.getItem('config'))?.quantityFrames || 4,
    models: jsonModels,
    frames: JSON.parse(localStorage.getItem('frames')) || jsonFrames,
  })

  console.log("config", config)

  {/*
    Start dateTime
    date: selectioned date
    timeRun: model execution time in hours
    maxDays: maximum number of days to display
    */ }
  function dateTime(date, timeRun, maxDays) {
    const year = String(date.getFullYear())
    const month = ("0" + (date.getMonth() + 1)).slice(-2)
    const day = ("0" + date.getDate()).slice(-2)
    const hour = ("0" + (date.getHours() + 1)).slice(-2)
    const minute = ("0" + (date.getMinutes() + 1)).slice(-2)
    // const second = ("0" + (date.getSeconds() + 1)).slice(-2)
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
    const weekName = weekdays[date.getDay()]
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const monthName = months[date.getMonth()]
    // console.log("year, month, day, hour, minute, second, weekName, monthName, timeRun", year, month, day, hour, minute, second, weekName, monthName, timeRun)

    let dateMinusTimeRun = []
    let yearMinusTimeRun = []
    let monthMinusTimeRun = []
    let dayMinusTimeRun = []
    let hourMinusTimeRun = []
    let monthNameMinusTimeRun = []
    let weekNameMinusTimeRun = []
    let lastTurn = []
    let formattedDateMinusTimeRun = []
    let fullDateMinusTimeRun = []

    let turns = 0
    if (timeRun == 24) {
      turns = maxDays - 1
    } else if (timeRun == 12) {
      turns = (2 * maxDays) - 1
    } else if (timeRun == 6) {
      turns = (4 * maxDays) - 1
    }

    for (let i = 0; i < turns; i++) {
      dateMinusTimeRun[i] = new Date(new Date().getTime() - ((i + 1) * (timeRun * 60 * 60) * 1000))
      yearMinusTimeRun[i] = String(dateMinusTimeRun[i].getFullYear())
      monthMinusTimeRun[i] = ("0" + (dateMinusTimeRun[i].getMonth() + 1)).slice(-2)
      dayMinusTimeRun[i] = ("0" + dateMinusTimeRun[i].getDate()).slice(-2)
      hourMinusTimeRun[i] = ("0" + (dateMinusTimeRun[i].getHours() + 1)).slice(-2)
      monthNameMinusTimeRun[i] = months[dateMinusTimeRun[i].getMonth()]
      weekNameMinusTimeRun[i] = weekdays[dateMinusTimeRun[i].getDay()]
      // console.log("dateMinusTimeRun[i]", dateMinusTimeRun[i])

      lastTurn[i] = null
      switch (timeRun) {
        case "06":
          if (Number(hourMinusTimeRun[i]) < 6) {
            lastTurn[i] = "00"
          } else if (Number(hourMinusTimeRun[i]) >= 6 && Number(hourMinusTimeRun[i]) < 12) {
            lastTurn[i] = "06"
          } else if (Number(hourMinusTimeRun[i]) >= 12 && Number(hourMinusTimeRun[i]) < 18) {
            lastTurn[i] = "12"
          } else {
            lastTurn[i] = "18"
          }
          break;
        case "12":
          if (Number(hourMinusTimeRun[i]) < 12) {
            lastTurn[i] = "00"
          } else {
            lastTurn[i] = "12"
          }
          break;
        default:
          lastTurn[i] = "00"
      }
      // console.log("lastTurn", lastTurn)

      formattedDateMinusTimeRun[i] = `${weekNameMinusTimeRun[i]} ${dayMinusTimeRun[i]} ${monthNameMinusTimeRun[i]} ${yearMinusTimeRun[i]} ${lastTurn[i]} UTC`
      fullDateMinusTimeRun[i] = `${yearMinusTimeRun[i]}${monthMinusTimeRun[i]}${dayMinusTimeRun[i]}${lastTurn[i]}`
    }

    return { date, timeRun, maxDays, year, month, day, hour, minute, weekName, monthName, yearMinusTimeRun, monthMinusTimeRun, dayMinusTimeRun, monthNameMinusTimeRun, weekNameMinusTimeRun, lastTurn, formattedDateMinusTimeRun, fullDateMinusTimeRun }
  }
  {/* End dateTime */ }

  return (
    <ConfigContext.Provider value={{ config, setConfig, dateTime }}>
      {children}
    </ConfigContext.Provider>
  )
}

ConfigProvider.propTypes = {
  children: PropTypes.node
}
