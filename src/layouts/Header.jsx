import { useContext } from 'react'
import { ConfigContext } from '../contexts/Config'

import imgLogo from "../assets/govbr-logo.png"

export default function Header() {

  const { config } = useContext(ConfigContext)

  const linksTop = [
    { label: 'Órgãos do governo', url: '#' },
    { label: 'Acesso à Informação', url: '#' },
    { label: 'Legislação', url: '#' },
    { label: 'Acessibilidade', url: '#' },
  ]

  const linksBottom = [
    { label: 'Previsão Numérica', url: '#' },
    { label: 'Clima', url: '#' },
    { label: 'Nowcasting', url: '#' },
    { label: 'Satélite', url: '#' },
    { label: 'Ondas', url: '#' },
    { label: 'Bacias', url: '#' },
    { label: 'Qualidade do Ar', url: '#' },
    { label: 'Pós Graduação', url: '#' },
  ]

  return (
    <>
      {config.showHeaderFooter &&
        <header className="bg-white w-full px-4 py-4">
          <div className="flex justify-between mb-3 h-10">
            <div className="flex items-center">
              <div><img src={imgLogo} alt="Logo" /></div>
              <div className="flex items-center">
                <span className="pl-2 ml-2 border-l-2 border-l-gray-400 text-md">Ministério da Ciência, Tecnologia e Inovação</span>
              </div>
            </div>
            <div className="flex items-center text-right">
              <nav className="hidden lg:flex">
                <ul>
                  {linksTop.map((link, index) => (
                    <li key={index} className="inline-block pl-4"><a href={link.url} className="text-blue-600 hover:text-blue-800">{link.label}</a></li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
          <div className="flex justify-between mb-3">
            <div className="flex flex-col">
              <div className="text-xl font-medium">Centro de Previsão de Tempo e Estudos Climáticos</div>
              <div className="text-xl hidden md:flex">CPTEC</div>
            </div>
          </div>
          <div className="flex justify-center">
            <nav>
              <ul>
                {linksBottom.map((link, index) => (
                  <li key={index} className="inline-block pr-4"><a href={link.url} className="text-blue-600 hover:text-blue-800">{link.label}</a></li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
      }
    </>
  )
}
