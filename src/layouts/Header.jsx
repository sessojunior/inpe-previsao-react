import { useContext } from 'react'
import { ConfigContext } from '../contexts/Config'

export default function Header() {

  const { config } = useContext(ConfigContext)

  return (
    <>
      {config.showHeaderFooter && 
        <header className="bg-gray-200 w-full h-48 flex justify-center items-center">
          <h1 className="text-2xl font-bold">Cabeçalho</h1>
        </header>
      }
    </>
  )
}
