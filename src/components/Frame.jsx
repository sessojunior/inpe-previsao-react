import { useState, useEffect } from 'react'

import { useContext } from 'react'
import { ConfigContext } from '../contexts/Config'

import FrameTop from './FrameTop'
import FrameImage from './FrameImage'

export default function Frame({ id }) {

  const { config, models, frames } = useContext(ConfigContext)

  // console.log("Frame (id, frame.forecastTime)", id, frame.forecastTime)
  // console.log("id", id)
  // console.log("frames", frames)

  // console.log("models", models)

  const [frame, setFrame] = useState(frames.find(item => item.id === id))
  // console.log("frames.find(item => item.id === id)", frames.find(item => item.id === id))
  // console.log("frame", frame)

  const [model, setModel] = useState(models.find(model => model.value === frame.model))
  // console.log("model", model)

  // console.log("frame.model", frame.model)

  // console.log("model", model)

  const [dates, setDates] = useState([])

  useEffect(() => {
    async function fetchUrlDates() {
      try {
        const response = await fetch(model.urlDates)
        const data = await response.json()
        setDates(data.datesRun)
      } catch (error) {
        console.log(error)

        // Limpa o localStorage para retirar variáveis armazenadas no localStorage que possam ter valores inválidos
        localStorage.clear()
      }
    }

    fetchUrlDates()
  }, [model])

  // console.log("model.value dates", model.value, dates)

  let classFrame = ""
  if (config.quantityFrames !== 1) {
    classFrame = "border-r border-b border-gray-r-300"
  }

  // console.log("frame", frame)
  // console.log("frame.timeRun", frame.timeRun)

  // console.log("model.urlDates", model.urlDates)

  // console.log("Frame dates", dates)

  return (
    <div className={`flex flex-col p-4 hover:bg-gray-50 ${classFrame}`}>
      <FrameTop frame={frame} setFrame={setFrame} model={model} setModel={setModel} dates={dates} />
      <FrameImage frame={frame} model={model} dates={dates} />
    </div>
  )
}
