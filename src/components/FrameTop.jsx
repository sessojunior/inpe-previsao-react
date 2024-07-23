import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useContext } from 'react'
import { ConfigContext } from '../contexts/Config'

import { FaChevronLeft, FaChevronRight, FaClock, FaPause, FaPlay } from 'react-icons/fa'
import { FaRegRectangleList } from 'react-icons/fa6'

import DropDownConfig from './DropDownConfig'
import DropDownTime from './DropDownTime'

export default function FrameTop({ frame, setFrame, model, setModel, models }) {

  const { config, setConfig } = useContext(ConfigContext)

  const classButton = "size-9 md:size-[38px] inline-flex justify-center items-center gap-2 rounded-md font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs md:text-sm"

  const classButtonActive = "size-9 md:size-[38px] inline-flex justify-center items-center gap-2 rounded-md font-medium bg-blue-700 border border-gray-200 text-gray-50 hover:bg-blue-600 text-xs md:text-sm"

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

  return (
    <div className="flex justify-between">
      <div className="flex relative">
        <button className={openDropdownConfig ? classButtonActive : classButton} onClick={handleDropdownConfig}><FaRegRectangleList /></button>
        {openDropdownConfig && <DropDownConfig frame={frame} setFrame={setFrame} models={models} model={model} setModel={setModel} />}
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
          {openDropdownTime && <DropDownTime frame={frame} setFrame={setFrame} model={model} />}
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
  models: PropTypes.array,
}
