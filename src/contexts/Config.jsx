import { useState, useEffect, createContext } from 'react'

import jsonModels from '../data/models.json'
import jsonRegions from '../data/regions.json'
import jsonFrames from '../data/frames.json'

export const ConfigContext = createContext({})

export default function ConfigProvider({ children }) {

  const [config, setConfig] = useState({
    showHeaderFooter: JSON.parse(localStorage.getItem('config'))?.showHeaderFooter ?? true,
    quantityFrames: JSON.parse(localStorage.getItem('config'))?.quantityFrames || 4,
    isAllPlaying: false,
  })
  const [frames, setFrames] = useState(JSON.parse(localStorage.getItem('frames')) || jsonFrames)
  const models = jsonModels
  const regions = jsonRegions

  useEffect(() => {
    // console.log("frames", frames)
    localStorage.setItem('config', JSON.stringify({ showHeaderFooter: config.showHeaderFooter, quantityFrames: config.quantityFrames }))
    // console.log("salvou no localStorage: config")
  }, [config])

  // console.log("config", config)

  useEffect(() => {
    const adjustedFrames = frames.map(frame => ({
      "id": frame.id,
      "model": frame.model,
      "group": frame.group,
      "product": frame.product,
      "region": frame.region,
    }));
    // console.log("frames", frames)
    // console.log("adjustedFrames", adjustedFrames)
    localStorage.setItem('frames', JSON.stringify(adjustedFrames))
    // console.log("salvou no localStorage: frames")
  }, [frames])

  // console.log("frames", frames)

  return (
    <ConfigContext.Provider value={{ config, setConfig, models, regions, frames, setFrames }}>
      {children}
    </ConfigContext.Provider>
  )
}

