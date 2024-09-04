import { useContext } from 'react'
import { ConfigContext } from '../contexts/ConfigContext'

import imgLogo from "../assets/govbr-logo.png"

export default function Header() {

  const { config } = useContext(ConfigContext)

  const linksTop = [
    { label: 'Órgãos do governo', url: 'https://www.gov.br/pt-br/orgaos-do-governo' },
    { label: 'Acesso à Informação', url: 'https://www.gov.br/acessoainformacao/pt-br' },
    { label: 'Legislação', url: 'http://www4.planalto.gov.br/legislacao' },
    { label: 'Acessibilidade', url: 'https://www.gov.br/governodigital/pt-br/acessibilidade-digital' },
  ]

  const linksBottom = [
    { label: 'Tempo', url: 'http://tempo.cptec.inpe.br' },
    { label: 'Clima', url: 'http://clima.cptec.inpe.br' },
    { label: 'Satélite', url: 'http://satelite.cptec.inpe.br/home/novoSite/index.jsp' },
    { label: 'Ondas', url: 'http://ondas.cptec.inpe.br' },
    { label: 'Bacias', url: 'https://bacias.cptec.inpe.br' },
    { label: 'Qualidade do Ar', url: 'http://meioambiente.cptec.inpe.br' },
    { label: 'Pós Graduação', url: 'http://www.inpe.br/posgraduacao/met/' },
  ]

  return (
    <>
      {config.showHeaderFooter &&
        <header className="bg-white w-full px-4 py-4 xl:max-w-[1280px] xl:mx-auto">
          <div className="flex justify-between mb-3 h-10">
              <div className="flex items-center">
                <div><a href="https://www.gov.br/pt-br"><img src={imgLogo} alt="Logo" /></a></div>
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
