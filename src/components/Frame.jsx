import { useState, useEffect } from 'react'

import { useContext } from 'react'
import { ConfigContext } from '../contexts/Config'

import FrameTop from './FrameTop'
import FrameImage from './FrameImage'
import { formatDate } from '../lib/formatDate'

export default function Frame({ id }) {

  const { config, models, frames } = useContext(ConfigContext)

  // console.log("Frame (id, frame.currentTime)", id, frame.currentTime)

  const [frame, setFrame] = useState(frames.find(item => item.id === id))
  const [model, setModel] = useState(models.find(model => model.value === frame.model))

  // console.log("frame.model", frame.model)
  // console.log("frame", frame)
  // console.log("models", models)

  // console.log("model", model)

  const [dates, setDates] = useState([])

  useEffect(() => {
    async function fetchUrlDates() {
      try {
        const response = await fetch(model.urlDates)
        const data = await response.json()
        setDates(data.datesRun)
      } catch (error) {
        // console.log(error)
      }
    }

    fetchUrlDates()
  }, [model])

  // console.log("model.value dates", model.value, dates)

  let classFrame = ""
  if (config.quantityFrames === 1) {
    classFrame = "flex flex-col border-l border-r border-gray-r-300 border-gray-l-300 p-4"
  } else {
    classFrame = "flex flex-col border-r border-b border-gray-r-300 p-4"
  }

  // console.log("frame", frame)
  // console.log("frame.timeRun", frame.timeRun)

  // console.log("model.urlDates", model.urlDates)

  // console.log("Frame dates", dates)

  return (
    <div className={classFrame}>
      <FrameTop frame={frame} setFrame={setFrame} model={model} setModel={setModel} dates={dates} />
      <FrameImage frame={frame} model={model} dates={dates} />
    </div>
  )
}
