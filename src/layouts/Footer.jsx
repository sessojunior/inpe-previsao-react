import { useContext } from 'react'

import { ConfigContext } from '../contexts/Config'

export default function Footer() {

  const { config } = useContext(ConfigContext)

  return (
    <>
      {config.showHeaderFooter &&
        <footer className="bg-gray-200 w-full h-96 flex justify-center items-center">
          <h1 className="text-2xl font-bold">Rodapé</h1>
        </footer>
      }
    </>
  )
}
