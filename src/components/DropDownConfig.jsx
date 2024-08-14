import { useContext } from 'react'
import { ConfigContext } from '../contexts/Config'

import { formatDate } from '../lib/formatDate'

export default function DropDownConfig({ frame, setFrame, model, setModel, dates }) {

  const { frames, setFrames, models } = useContext(ConfigContext)

  const classSelect = "py-2 px-2 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"

  const classRadio = "block shrink-0 mr-1 border border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"

  const handleChangeModel = (e) => {
    const model = models.find(model => model.value === e.target.value)
    setModel(model)
    setFrame({
      ...frame,
      model: e.target.value,
      region: model.defaultValues.region.value,
      product: model.defaultValues.product.value,
      currentTime: model.possibleValues.time[0],
    })
    setFrames([...frames.slice(0, frame.id - 1), {
      ...frame,
      model: e.target.value,
      region: model.defaultValues.region.value,
      product: model.defaultValues.product.value,
      currentTime: model.possibleValues.time[0],
    }, ...frames.slice(frame.id)])
    // console.log("handleChangeModel (model)", model)
    // console.log("handleChangeModel (frame)", frame)
    // console.log("frame.region", frame.region)
    // console.log("model.possibleValues.region", model.possibleValues.region.find(region => region.value === frame.region))
    // console.log("model.possibleValues.region.find", model.possibleValues.region.find(region => region.value === frame.region))
  }

  const handleChangeRegion = (e) => {
    setFrame({ ...frame, region: e.target.value })
    setFrames([...frames.slice(0, frame.id - 1), { ...frame, region: e.target.value }, ...frames.slice(frame.id)])
  }

  const handleChangeProduct = (e) => {
    setFrame({ ...frame, product: e.target.value })
    setFrames([...frames.slice(0, frame.id - 1), { ...frame, product: e.target.value }, ...frames.slice(frame.id)])
  }

  const handleChangeInit = (e) => {
    setFrame({ ...frame, init: e.target.value })
    setFrames([...frames.slice(0, frame.id - 1), { ...frame, init: e.target.value }, ...frames.slice(frame.id)])
  }

  console.log("dates", dates)

  // console.log("frames", frames)
  // console.log("possibleValues", model.possibleValues)
  // console.log("possibleValues.model", model.possibleValues.model)
  // console.log("id", id)
  // console.log("TopFrame (frame)", frame)

  return (
    <div>
      <form>
          <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-md w-60">
            <div className="border-b border-gray-200 p-4">
              <div className="mb-2">
                <label className="block w-full pb-3 text-sm font-bold">Modelo e região</label>
                <select name="model" value={frame.model} onChange={e => handleChangeModel(e)} className={classSelect}>
                  {models.map((model, index) => (
                    <option key={index} value={model.value}>{model.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <select name="region" value={frame.region} onChange={e => handleChangeRegion(e)} className={classSelect}>
                  {model.possibleValues.region.map((region, index) => (
                    <option key={index} value={region.value}>Região {region.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="border-b border-gray-200 p-4">
              <div className="mb-2">
                <label className="block w-full pb-3 text-sm font-bold">Produto</label>
                <select name="product" value={frame.product} onChange={e => handleChangeProduct(e)} className={classSelect}>
                  {model.possibleValues.product.map((product, index) => (
                    <option key={index} value={product.value}>{product.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="border-b border-gray-200 p-4">
              <div>
              <label htmlFor="init" className="block w-full pb-3 text-sm font-bold">Inicialização</label>
              {dates.length > 0 ? (
                <select name="init" value={frame.init === null ? dates[0] : frame.init} onChange={e => handleChangeInit(e)} className={classSelect}>
                  {dates.map((date, index) => (
                    <option key={index} value={date}>{formatDate(date)}</option>
                  ))}
                </select>
              ) : (
                <p>Carregando...</p>
              )}
              </div>
            </div>
          </div>
        </form>
    </div>
  )
}
