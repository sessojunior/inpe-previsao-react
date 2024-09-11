import { useState, useEffect, useContext } from 'react'
import { ConfigContext } from '../contexts/ConfigContext'

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

  const [model, setModel] = useState(models.find(model => model.value === frame?.model))

  // console.log("model", model)
  // console.log("frame.model", frame.model)
  // console.log("model", model)

  // Corrigindo bug de values errados no model ou frame
  // Se não foi possível carregar o arquivo JSON de Config.jsx
  if (!frame || !model) {
    console.error("É provável que não tenha sido possível carregar o arquivo models.json ou regions.json em Config.jsx")
    localStorage.clear()
    setTimeout(() => {
      window.location.reload()
    }, 15000)
    //window.location.reload()
    return <div className="p-8 text-red-500">Dados do modelo inválido no arquivo JSON. Recarregue a página agora ou aguarde ela ser recarregada automaticamente em 15 segundos.</div>;
  }

  const [dates, setDates] = useState([])

  useEffect(() => {
    async function fetchUrlDates() {
      try {
        const response = await fetch(model.urlDates)
        const data = await response.json()
        setDates(data.datesRun)
      } catch (error) {
        console.log(error)
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

  const [loadingImages, setLoadingImages] = useState(false)
  const [downloadImageUrl, setDownloadImageUrl] = useState("")

  // console.log("Frame loadingImages", loadingImages)

  return (
    <div className={`flex flex-col p-4 hover:bg-gray-50 ${classFrame}`}>
      <FrameTop frame={frame} setFrame={setFrame} model={model} setModel={setModel} dates={dates} loadingImages={loadingImages} setLoadingImages={setLoadingImages} downloadImageUrl={downloadImageUrl} />
      <FrameImage frame={frame} model={model} dates={dates} loadingImages={loadingImages} setDownloadImageUrl={setDownloadImageUrl} />
    </div>
  )
}
