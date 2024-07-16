import { useState, createContext } from 'react'
import PropTypes from 'prop-types'

import jsonModels from '../data/models.json'
import jsonFrames from '../data/frames.json'

export const ConfigContext = createContext({})

export default function ConfigProvider({ children }) {
  
  const [config, setConfig] = useState({
    showHeaderFooter: true,
    quantityFrames: 4,
    models: jsonModels,
    frames: JSON.parse(localStorage.getItem('frames')) || jsonFrames,
  })

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}

ConfigProvider.propTypes = {
  children: PropTypes.node
}
