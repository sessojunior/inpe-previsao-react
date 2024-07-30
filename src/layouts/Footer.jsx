import { useContext } from 'react'

import { ConfigContext } from '../contexts/Config'

import { FaCookieBite, FaXTwitter } from "react-icons/fa6";
import { FaYoutube, FaFacebook, FaInstagramSquare } from "react-icons/fa";

import AcessoInformacao from "../assets/acesso-informacao.svg"

export default function Footer() {

  const { config } = useContext(ConfigContext)

  const linksAcesso = [
    { label: 'Institucional', url: '#' },
    { label: 'Ações e Programas', url: '#' },
    { label: 'Participação Social', url: '#' },
    { label: 'Auditorias', url: '#' },
    { label: 'Convênios e Transferências', url: '#' },
    { label: 'Receitas e Despesas', url: '#' },
    { label: 'Licitações e Contratos', url: '#' },
    { label: 'Servidores', url: '#' },
    { label: 'Informações Classificadas', url: '#' },
    { label: 'Serviço de Informação ao Cidadão - SIC', url: '#' },
    { label: 'Perguntas Frequentes', url: '#' },
    { label: 'Dados Abertos', url: '#' },
    { label: 'Cooperações Nacionais e Internacionais', url: '#' },
    { label: 'Transparência e Prestação de Contas', url: '#' },
  ]

  const linksAssuntos = [
    { label: 'Últimas Notícias', url: '#' },
    { label: 'Produtos', url: '#' },
    { label: 'Eventos', url: '#' },
    { label: 'Capacitação Pós-Graduação', url: '#' },
    { label: 'Anúncio de Oportunidades', url: '#' },
    { label: 'Atuação do INPE no Desastre do RS', url: '#' },
  ]

  const linksCentral = [
    { label: 'Cartilhas Educacionais', url: '#' },
    { label: 'Publicações', url: '#' },
    { label: 'Biblioteca On-Line', url: '#' },
    { label: 'Vídeos', url: '#' },
    { label: 'Área de Conhecimento', url: '#' },
    { label: 'Vídeos Institucionais', url: '#' },
  ]

  const linksCanais = [
    { label: 'Ouvidoria', url: '#' },
    { label: 'Imprensa', url: '#' },
    { label: 'Visitas ao INPE', url: '#' },
  ]

  return (
    <>
      {config.showHeaderFooter &&
        <footer className="w-full flex flex-col">
          <div className="bg-blue-900 w-full flex flex-col px-4 pt-4 pb-8">
            <div className="my-6 lg:my-8">
              <img src="src/assets/govbr-logo-white.png" alt="" className="h-10 lg:h-14" />
            </div>
            <div className="grid lg:grid-cols-4 gap-4">
              <div className="pb-4">
                <h2 className="text-lg text-white font-medium uppercase pb-4">Acesso à informação</h2>
                <ul>
                  {linksAcesso.map((link, index) => (
                    <li key={index}><a href={link.url} className="text-white hover:text-gray-300">{link.label}</a></li>
                  ))}
                </ul>
              </div>
              <div className="pb-4">
                <h2 className="text-lg text-white font-medium uppercase pb-4">Assuntos</h2>
                <ul>
                  {linksAssuntos.map((link, index) => (
                    <li key={index}><a href={link.url} className="text-white hover:text-gray-300">{link.label}</a></li>
                  ))}
                </ul>
              </div>
              <div className="pb-4">
                <h2 className="text-lg text-white font-medium uppercase pb-4">Central de conteúdo</h2>
                <ul>
                  {linksCentral.map((link, index) => (
                    <li key={index}><a href={link.url} className="text-white hover:text-gray-300">{link.label}</a></li>
                  ))}
                </ul>
              </div>
              <div className="pb-4">
                <h2 className="text-lg text-white font-medium uppercase pb-4">Canais de atendimento</h2>
                <ul>
                  {linksCanais.map((link, index) => (
                    <li key={index}><a href={link.url} className="text-white hover:text-gray-300">{link.label}</a></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col py-8">
              <a href="#" className="text-white flex items-center"><span className="pr-2"><FaCookieBite /></span> Redefinir Cookies</a>
            </div>
            <div className="pb-4 flex justify-between">
              <div>
                <h2 className="text-lg text-white font-medium uppercase pb-4">Redes sociais</h2>
                <ul>
                  <li className="inline-block pr-4"><a href="#" className="text-white hover:text-gray-300"><FaXTwitter /></a></li>
                  <li className="inline-block pr-4"><a href="#" className="text-white hover:text-gray-300"><FaYoutube /></a></li>
                  <li className="inline-block pr-4"><a href="#" className="text-white hover:text-gray-300"><FaFacebook /></a></li>
                  <li className="inline-block pr-4"><a href="#" className="text-white hover:text-gray-300"><FaInstagramSquare /></a></li>
                </ul>
              </div>
              <div className="flex items-center">
                <a href="#">
                  <img src={AcessoInformacao} alt="" className="" />
                </a>
              </div>
            </div>
          </div>
          <div className="flex bg-blue-950 justify-center">
            <p className="text-white text-center p-4">Todo o conteúdo deste site está publicado sob a licença <a href="#" className="font-bold hover:text-blue-400">Creative Commons Atribuição-SemDerivações 3.0 Não Adaptada</a>.</p>
          </div>
        </footer>
      }
    </>
  )
}
