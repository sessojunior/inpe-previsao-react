import { useEffect, useState, useContext } from 'react'
import { ConfigContext } from '../contexts/ConfigContext'

export default function FrameImage({ frame, model, dates }) {

  // console.log("FrameImage")

  const { config } = useContext(ConfigContext)

  if (frame === undefined || model === undefined || dates.length === 0) return false

  const publicImage = "image-not-found.jpg"

  const init = frame.init ?? dates[0]
  const year = init?.slice(0, 4)
  const month = init?.slice(5, 7)
  const day = init?.slice(8, 10)
  const turn = init?.slice(11, 13)
  const forecastTime = frame.forecastTime ?? model.periodStart

  // console.log("frame", frame)
  // console.log("init", init)
  // console.log("dates", dates)
  // console.log("FrameImage model", model)
  // console.log("model.urlImage", model.urlImage)

  const urlImage = model.urlImage.replaceAll("{{model}}", model.value)
    .replaceAll("{{region}}", frame.region)
    .replaceAll("{{product}}", frame.product)
    .replaceAll("{{forecastTime}}", forecastTime)
    .replaceAll("{{timeRun}}", model.timeRun)
    .replaceAll("{{turn}}", turn)
    .replaceAll("{{year}}", year)
    .replaceAll("{{month}}", month)
    .replaceAll("{{day}}", day)

  const altImage = `${frame.model} - ${frame.region}`

  // console.log("frame.forecastTime", frame.forecastTime)
  // console.log("urlImage", urlImage)

  console.log("config.isAllPlaying", config.isAllPlaying)
  console.log("config.framesWithImagesLoaded", config.framesWithImagesLoaded)

  return (
    <div>
      {/* <p className="pb-2">URL do modelo:
        <br /><b>{model.urlImage.replaceAll("{{", " {{").replaceAll("}}", "}} ")}</b></p>
      <p className="pb-2">URL convertida:
        <br />[<b>{
          model.urlImage.replaceAll("{{model}}", " " + model.value + " ")
            .replaceAll("{{region}}", " " + frame.region + " ")
            .replaceAll("{{product}}", " " + frame.product + " ")
            .replaceAll("{{forecastTime}}", " " + forecastTime + " ")
            .replaceAll("{{timeRun}}", " " + model.defaultValues.timeRun + " ")
            .replaceAll("{{turn}}", " " + turn + " ")
            .replaceAll("{{year}}", " " + year + " ")
            .replaceAll("{{month}}", " " + month + " ")
            .replaceAll("{{day}}", " " + day + " ")}</b>]</p>
      <p className="pb-2">Dados para a troca de imagem:</p>
      <p>[frame.model: <b>{frame.model}</b>]</p>
      <p>[frame.region: <b>{frame.region}</b>]</p>
      <p>[frame.product: <b>{frame.product}</b>]</p>
      <p>[model.possibleValues.time: <b>{model.possibleValues.time.map(time => time + " ")}</b>]</p>
      <p><b>[frame.forecastTime: <b>{frame.forecastTime}</b>]</b></p>
      <p><b>[forecastTime: <b>{forecastTime}</b>]</b></p>
      <p>[frame.isPlaying: <b>{frame.isPlaying ? "true" : "false"}</b>]</p>
      <p>[frame.timeRun: <b>{frame.timeRun}</b>]</p>
      <p>[frame.init: <b>{frame.init}</b>]</p>
      <p>[init: <b>{init}</b>]</p>
      <p>[timeRun: <b>{frame.timeRun}</b>]</p>
      <p>[year: <b>{year}</b>]</p>
      <p>[month: <b>{month}</b>]</p>
      <p>[day: <b>{day}</b>]</p>
      <p>[turn: <b>{turn}</b>]</p> */}
      <div className="w-full">
        <img src={urlImage} onError={(e) => { e.target.onError = null; e.target.src = publicImage }} alt={altImage} className="rounded-md mt-4 w-full" />
        <div className="mt-4 flex justify-end">
          <a href={urlImage} download="imagem-de-previsao.png" target="_blank" rel="noreferrer" className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700" title={urlImage}>Download da imagem</a>
        </div>
      </div>
    </div>
  )
}
