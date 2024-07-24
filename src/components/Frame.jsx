import { useState } from 'react'
import PropTypes from 'prop-types'

import { useContext } from 'react'
import { ConfigContext } from '../contexts/Config'

import FrameTop from './FrameTop'
import FrameImage from './FrameImage'

export default function Frame({ id }) {

  const { config, models, frames, dateTime } = useContext(ConfigContext)

  const [frame, setFrame] = useState(frames.find(frame => frame.id === id))

  console.log("Frame (id, frame.currentTime)", id, frame.currentTime)

  // console.log("frame.model", frame.model)
  // console.log("models", models)

  const [model, setModel] = useState(models.find(model => model.value === frame.model))
  // console.log("model", model)

  let classFrame = ""
  if (config.quantityFrames === 1) {
    classFrame = "flex flex-col border-l border-r border-gray-r-300 border-gray-l-300 p-4"
  } else {
    classFrame = "flex flex-col border-r border-b border-gray-r-300 p-4"
  }

  // console.log("frame", frame)
  // console.log("frame.timeRun", frame.timeRun)

  const date = dateTime(new Date(), frame.timeRun, frame.maxDays)
  // console.log("date", date)

  return (
    <div className={classFrame}>
      <FrameTop frame={frame} setFrame={setFrame} model={model} setModel={setModel} date={date} />
      <FrameImage frame={frame} model={model} date={date} />
    </div>
  )
}

Frame.propTypes = {
  id: PropTypes.number,
}
