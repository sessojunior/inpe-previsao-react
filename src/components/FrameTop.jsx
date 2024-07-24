import { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'

import { ConfigContext } from '../contexts/Config'

import { FaChevronLeft, FaChevronRight, FaClock, FaCog, FaPause, FaPlay } from 'react-icons/fa'

import DropDownConfig from './DropDownConfig'
import DropDownTime from './DropDownTime'

export default function FrameTop({ frame, setFrame, model, setModel, date }) {

  console.log("FrameTop")

  const { config, setConfig } = useContext(ConfigContext)

  const classButton = "size-9 md:size-[38px] inline-flex justify-center items-center gap-2 rounded-md font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs md:text-sm"

  const classButtonActive = "size-9 md:size-[38px] inline-flex justify-center items-center gap-2 rounded-md font-medium bg-blue-600 border border-gray-200 text-gray-50 hover:bg-blue-500 text-xs md:text-sm"

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

  const [timer, setTimer] = useState(0);
  const [timeInterval, setTimeInterval] = useState(null);
  const [currentTime, setCurrentTime] = useState(model.possibleValues.time[model.possibleValues.time.indexOf(frame.currentTime)])

  useEffect(() => {
    console.log("currentTime", currentTime)
    if (timer > 0) {
      setFrame({ ...frame, currentTime: currentTime })
    }
  }, [timer])

  useEffect(() => {
    config.isAllPlaying ? startTimer() : pauseTimer()
  }, [config.isAllPlaying])

  const startTimer = () => {
    console.log("startTimer")
    if (config.isAllPlaying) {
      clearInterval(timeInterval)
      setCurrentTime(model.possibleValues.time[0])
      setFrame({ ...frame, currentTime: model.possibleValues.time[0] })
    }
    setTimeInterval(setInterval(() => {
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

  const pauseTimer = () => {
    clearInterval(timeInterval)
    setFrame({ ...frame, isPlaying: false })
    setConfig({ ...config, isAllPlaying: false })
  }

  // const resetTimer = () => {
  //   // Reset the timer value to 0
  //   setTimer(0)
  //   setFrame({ ...frame, isPlaying: true, currentTime: model.possibleValues.time[0] })
  //   setFrames([...frames.slice(0, frame.id - 1), { ...frame, isPlaying: true, currentTime: model.possibleValues.time[0] }, ...frames.slice(frame.id)])
  //   clearInterval(timeInterval)
  // }

  {/* End Timer */ }

  return (
    <div className="flex justify-between">
      <div className="flex relative">
        <button className={openDropdownConfig ? classButtonActive : classButton} onClick={handleDropdownConfig}><FaCog /></button>
        {openDropdownConfig && <DropDownConfig frame={frame} setFrame={setFrame} model={model} setModel={setModel} date={date} />}
        <div className="mx-2">
          <div className="font-bold text-sm">{/* {frame.model} */} {model.label} {">"} Região {/* {frame.region} */} {model.possibleValues.region.find(region => region.value === frame.region).label}
          </div>
          <div className="text-xs">{frame.init ?? date.formattedDateMinusTimeRun[0]}</div>
        </div>
      </div>
      <div className="flex relative">
        <div className="flex gap-1">
          <button className={classButton} onClick={handleDecreaseTime}><FaChevronLeft /></button>
          {frame.isPlaying ? (
            <button className={classButtonActive} onClick={pauseTimer}><FaPause /></button>
          ) : (
            <button className={classButton} onClick={startTimer}><FaPlay /></button>
          )}
          {/* <button className={classButton} onClick={resetTimer}>Reset</button> */}
          <button className={classButton} onClick={handleIncreaseTime}><FaChevronRight /></button>
        </div>
        <div className="flex items-center">
          <div className="font-bold text-sm px-2">{frame.currentTime} horas</div>
          <button className={openDropdownTime ? classButtonActive : classButton} onClick={handleDropdownTime}><FaClock /></button>
          {openDropdownTime && <DropDownTime currentTime={currentTime} setCurrentTime={setCurrentTime} frame={frame} setFrame={setFrame} model={model} />}
        </div>
      </div>
    </div>
  )
}

FrameTop.propTypes = {
  frame: PropTypes.object,
  setFrame: PropTypes.func,
  model: PropTypes.object,
  setModel: PropTypes.func,
  date: PropTypes.object,
}
