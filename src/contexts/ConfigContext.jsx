import { useState, useEffect, createContext } from 'react'

import jsonModels from '../data/models.json'
import jsonRegions from '../data/regions.json'

export const ConfigContext = createContext({})

export default function ConfigProvider({ children }) {

  const [config, setConfig] = useState({
    showHeaderFooter: JSON.parse(localStorage.getItem('config'))?.showHeaderFooter ?? true,
    quantityFrames: JSON.parse(localStorage.getItem('config'))?.quantityFrames || 1,
    isAllPlaying: false, // Se todos os frames estão em play
    framesWithImagesLoaded: [], // Array para armazenar os IDs dos frames que já pré-carregaram as imagens
  })

  const models = jsonModels
  const regions = jsonRegions

  // console.log("models", models)
  // console.log("models[0].value", models[0].value)

  let initialFrames = []
  for (let i = 0; i < 4; i++) {
    initialFrames.push({
      "id": i + 1,
      "model": models[0].value,
      "product": models[0].default.product.value,
      "group": models[0].default.product.group,
      "region": models[0].default.product.region,
      "forecastTime": null,
      "isPlaying": false,
      "init": null,
    })
  }

  const [frames, setFrames] = useState(JSON.parse(localStorage.getItem('frames')) || initialFrames)

  // console.log("jsonFrames", jsonFrames)

  useEffect(() => {
    localStorage.setItem('config', JSON.stringify({ showHeaderFooter: config.showHeaderFooter, quantityFrames: config.quantityFrames }))
    // console.log("salvou no localStorage: config")
  }, [config])

  // console.log("config", config)

  useEffect(() => {
    const localFrames = frames.map(frame => ({
      "id": frame.id,
      "model": frame.model,
      "product": frame.product,
      "group": frame.group,
      "region": frame.region,
    }));
    // console.log("frames", frames)
    // console.log("localFrames", localFrames)
    localStorage.setItem('frames', JSON.stringify(localFrames))
    // console.log("salvou no localStorage: frames")
  }, [frames])

  // console.log("frames", frames)

  return (
    <ConfigContext.Provider value={{ config, setConfig, models, regions, frames, setFrames }}>
      {children}
    </ConfigContext.Provider>
  )
}

