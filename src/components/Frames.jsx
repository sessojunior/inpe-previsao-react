import Frame from "./Frame"

import { Suspense, useContext } from 'react'
import { ConfigContext } from '../contexts/Config'

export default function Frames() {

  const { config } = useContext(ConfigContext)
  // console.log("config", config)

  // console.log("Frames")

  return (
    <>
      {config.quantityFrames === 1 && (
        <div className="flex justify-center items-center max-w-full mx-auto">
          <Frame id={1} />
        </div>
      )}
      {(config.quantityFrames === 2) && (
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <Frame id={1} />
          <Frame id={2} />
        </div>
      )}
      {(config.quantityFrames === 4) && (
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <Suspense fallback={<div>Carregando...</div>}>
            <Frame id={1} />
          </Suspense>
          <Suspense fallback={<div>Carregando...</div>}>
            <Frame id={2} />
          </Suspense>
          <Suspense fallback={<div>Carregando...</div>}>
            <Frame id={3} />
          </Suspense>
          <Suspense fallback={<div>Carregando...</div>}>
            <Frame id={4} />
          </Suspense>
        </div>
      )}
    </>
  )
}
