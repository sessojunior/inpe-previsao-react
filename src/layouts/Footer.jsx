import { useContext } from "react";

import { ConfigContext } from "../contexts/ConfigContext";

import { FaCookieBite, FaXTwitter } from "react-icons/fa6";
import { FaYoutube, FaFacebook, FaInstagramSquare } from "react-icons/fa";

import AcessoInformacao from "../assets/acesso-informacao.svg";
import imgLogoWhite from "../assets/govbr-logo-white.png";

export default function Footer() {
  const { config } = useContext(ConfigContext);

  const linksAcesso = [
    {
      label: "Institucional",
      url: "https://www.gov.br/inpe/pt-br/acesso-a-informacao/institucional",
    },
    {
      label: "Ações e Programas",
      url: "https://www.gov.br/inpe/pt-br/acesso-a-informacao/acoes-e-programas",
    },
    {
      label: "Participação Social",
      url: "https://www.gov.br/inpe/pt-br/acesso-a-informacao/participacao-social",
    },
    {
      label: "Auditorias",
      url: "https://www.gov.br/inpe/pt-br/acesso-a-informacao/auditorias",
    },
    {
      label: "Convênios e Transferências",
      url: "https://www.gov.br/inpe/pt-br/acesso-a-informacao/convenios-e-transferencias",
    },
    {
      label: "Receitas e Despesas",
      url: "https://www.gov.br/inpe/pt-br/acesso-a-informacao/receitas-e-despesas",
    },
    {
      label: "Licitações e Contratos",
      url: "https://www.gov.br/inpe/pt-br/acesso-a-informacao/licitacoes-e-contratos",
    },
    {
      label: "Servidores",
      url: "https://www.gov.br/inpe/pt-br/acesso-a-informacao/servidores",
    },
    {
      label: "Informações Classificadas",
      url: "https://www.gov.br/inpe/pt-br/acesso-a-informacao/informacoes-classificadas",
    },
    {
      label: "Serviço de Informação ao Cidadão - SIC",
      url: "https://www.gov.br/inpe/pt-br/acesso-a-informacao/servico-de-informacao-ao-cidadao-sic",
    },
    {
      label: "Perguntas Frequentes",
      url: "https://www.gov.br/inpe/pt-br/acesso-a-informacao/perguntas-frequentes",
    },
    {
      label: "Dados Abertos",
      url: "https://www.gov.br/inpe/pt-br/acesso-a-informacao/dados-abertos",
    },
    {
      label: "Transparência e Prestação de Contas",
      url: "https://www.gov.br/inpe/pt-br/acesso-a-informacao/transparencia-e-prestacao-de-contas",
    },
  ];

  const linksAssuntos = [
    {
      label: "Últimas Notícias",
      url: "https://www.gov.br/inpe/pt-br/assuntos/ultimas-noticias",
    },
    {
      label: "Produtos",
      url: "https://www.gov.br/inpe/pt-br/assuntos/produtos",
    },
    { label: "Eventos", url: "https://www.gov.br/inpe/pt-br/assuntos/eventos" },
    {
      label: "Capacitação Pós-Graduação",
      url: "https://www.gov.br/inpe/pt-br/area-conhecimento/posgraduacao/",
    },
    {
      label: "Anúncio de Oportunidades",
      url: "https://www.gov.br/inpe/pt-br/assuntos/anuncio-de-oportunidades",
    },
    {
      label: "Atuação do INPE no Desastre do RS",
      url: "https://www.gov.br/inpe/pt-br/assuntos/atuacao-do-inpe-no-desastre-no-rs",
    },
  ];

  const linksCentral = [
    {
      label: "Cartilhas Educacionais",
      url: "https://www.gov.br/inpe/pt-br/central-de-conteudo/cartilhas-educacionais",
    },
    {
      label: "Publicações",
      url: "https://www.gov.br/inpe/pt-br/central-de-conteudo/publicacoes",
    },
    {
      label: "Biblioteca On-Line",
      url: "https://www.gov.br/inpe/pt-br/area-conhecimento/biblioteca",
    },
    { label: "Vídeos", url: "http://www.youtube.com/inpemct" },
    {
      label: "Área de Conhecimento",
      url: "https://www.gov.br/inpe/pt-br/area-conhecimento",
    },
    {
      label: "Vídeos Institucionais",
      url: "https://www.gov.br/inpe/pt-br/central-de-conteudo/videos-institucionais",
    },
  ];

  const linksCanais = [
    {
      label: "Ouvidoria",
      url: "https://www.gov.br/inpe/pt-br/canais_atendimento/ouvidoria",
    },
    {
      label: "Imprensa",
      url: "https://www.gov.br/inpe/pt-br/canais_atendimento/imprensa",
    },
    {
      label: "Visitas ao INPE",
      url: "http://www.gov.br/inpe/pt-br/acesso-a-informacao/institucional/visita/",
    },
  ];

  return (
    <>
      {config.showHeaderFooter && (
        <footer className="w-full flex flex-col bg-blue-900">
          <div className="bg-blue-900 w-full flex flex-col px-4 pt-4 pb-8 xl:max-w-[1280px] xl:mx-auto">
            <div className="my-6 lg:my-8">
              <img
                src={imgLogoWhite}
                alt="Governo Federal"
                className="h-10 lg:h-14"
              />
            </div>
            <div className="grid lg:grid-cols-4 gap-4">
              <div className="pb-4">
                <h2 className="text-lg text-white font-medium uppercase pb-4">
                  <a href="https://www.gov.br/inpe/pt-br/acesso-a-informacao">
                    Acesso à informação
                  </a>
                </h2>
                <ul className="leading-7">
                  {linksAcesso.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.url}
                        className="text-white hover:text-gray-300"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pb-4">
                <h2 className="text-lg text-white font-medium uppercase pb-4">
                  <a href="https://www.gov.br/inpe/pt-br/assuntos">Assuntos</a>
                </h2>
                <ul className="leading-7">
                  {linksAssuntos.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.url}
                        className="text-white hover:text-gray-300"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pb-4">
                <h2 className="text-lg text-white font-medium uppercase pb-4">
                  <a href="https://www.gov.br/inpe/pt-br/central-de-conteudo">
                    Central de conteúdo
                  </a>
                </h2>
                <ul className="leading-7">
                  {linksCentral.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.url}
                        className="text-white hover:text-gray-300"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pb-8">
                <h2 className="text-lg text-white font-medium uppercase pb-4">
                  <a href="https://www.gov.br/inpe/pt-br/canais_atendimento">
                    Canais de atendimento
                  </a>
                </h2>
                <ul className="leading-7">
                  {linksCanais.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.url}
                        className="text-white hover:text-gray-300"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* <div className="flex flex-col py-4">
              <a href="#" className="text-white flex items-center"><span className="pr-2"><FaCookieBite /></span> Redefinir Cookies</a>
            </div> */}
            <div className="py-4 flex justify-between">
              <div>
                <h2 className="text-lg text-white font-medium uppercase pb-4">
                  Redes sociais
                </h2>
                <ul>
                  <li className="inline-block pr-4">
                    <a
                      href="https://www.twitter.com/inpe_mcti"
                      className="text-white hover:text-gray-300"
                    >
                      <FaXTwitter />
                    </a>
                  </li>
                  <li className="inline-block pr-4">
                    <a
                      href="https://www.youtube.com/inpemct"
                      className="text-white hover:text-gray-300"
                    >
                      <FaYoutube />
                    </a>
                  </li>
                  <li className="inline-block pr-4">
                    <a
                      href="https://www.facebook.com/inpe.oficial"
                      className="text-white hover:text-gray-300"
                    >
                      <FaFacebook />
                    </a>
                  </li>
                  <li className="inline-block pr-4">
                    <a
                      href="https://www.instagram.com/inpe.oficial"
                      className="text-white hover:text-gray-300"
                    >
                      <FaInstagramSquare />
                    </a>
                  </li>
                </ul>
              </div>
              <div className="flex items-center">
                <a href="https://www.gov.br/acessoainformacao/pt-br">
                  <img src={AcessoInformacao} alt="" className="" />
                </a>
              </div>
            </div>
          </div>
          <div className="flex bg-blue-950 justify-center">
            <p className="text-white text-center p-4">
              Todo o conteúdo deste site está publicado sob a licença{" "}
              <a
                href="https://creativecommons.org/licenses/by-nd/3.0/deed.pt_BR"
                className="font-bold hover:text-blue-400"
              >
                Creative Commons Atribuição-SemDerivações 3.0 Não Adaptada
              </a>
              .
            </p>
          </div>
        </footer>
      )}
    </>
  );
}
