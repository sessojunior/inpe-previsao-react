import Frame from "./Frame"

import { useContext } from 'react'
import { ConfigContext } from '../contexts/Config'

export default function Frames() {
  
  const { config } = useContext(ConfigContext)
  // console.log("config", config)

  return (
    <>
      {config.quantityFrames === 1 && (
        <div className="flex justify-center items-center max-w-3xl mx-auto">
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
          <Frame id={1} />
          <Frame id={2} />
          <Frame id={3} />
          <Frame id={4} />
        </div>
      )}
    </>
  )
}
