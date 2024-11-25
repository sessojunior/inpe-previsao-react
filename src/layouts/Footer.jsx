import { useContext, useState, useEffect } from "react";
import { ConfigContext } from "../contexts/ConfigContext";

import {
  FaYoutube,
  FaFacebookF,
  FaInstagram,
  FaChevronDown,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import AcessoInformacao from "../assets/acesso-informacao.png";
import imgLogoWhite from "../assets/govbr-logo-white.png";

export default function Footer() {
  const { config } = useContext(ConfigContext);
  const [activeSection, setActiveSection] = useState(null);
  const [activeLinks, setActiveLinks] = useState(null);

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

  const linksSocial = [
    {
      label: "Facebook",
      url: "https://www.facebook.com/inpe.oficial",
      icon: FaFacebookF,
    },
    {
      label: "Instagram",
      url: "https://www.instagram.com/cptecinpe/",
      icon: FaInstagram,
    },
    {
      label: "Twitter",
      url: "https://x.com/inpe_mct",
      icon: FaXTwitter,
    },
    {
      label: "YouTube",
      url: "https://www.youtube.com/inpemct",
      icon: FaYoutube,
    },
  ];

  useEffect(() => {
    setActiveSection("acesso");
    setActiveLinks(linksAcesso);
  }, []);

  const toggleSection = (section, links) => {
    setActiveSection(activeSection === section ? null : section);
    setActiveLinks(links);
  };

  const TitleMenuSection = ({ section, label, links }) => {
    return (
      <div className="inline-block mr-2 my-2 border-b border-[#6B788E]">
        <div
          className={`flex items-center justify-between cursor-pointer p-2 text-white hover:bg-[#263A5D] rounded ${
            activeSection === section ? "bg-[#263A5D]" : ""
          }`}
          onClick={() => toggleSection(section, links)}
        >
          <h2 className="text-lg font-medium">{label}</h2>
          <FaChevronDown
            size={12}
            className={`ml-2 transition-transform duration-300 ${
              activeSection === section ? "transform rotate-180" : ""
            }`}
          />
        </div>
      </div>
    );
  };

  const TitleLinkSection = ({ label, url }) => {
    return (
      <div className="inline-block mr-2 border-b border-[#6B788E]">
        <div className="flex items-center justify-between cursor-pointer p-2 text-white hover:bg-[#263A5D] rounded">
          <h2 className="text-lg font-medium">
            <a href={url}>{label}</a>
          </h2>
        </div>
      </div>
    );
  };

  return (
    <>
      {config.showHeaderFooter && (
        <footer className="w-full flex flex-col bg-[#071D41]">
          <div className="w-full flex flex-col px-4 pt-4 pb-8 xl:max-w-[1280px] xl:mx-auto">
            <div className="my-6 lg:my-8">
              <img
                src={imgLogoWhite}
                alt="Governo Federal"
                className="h-10 lg:h-12"
              />
            </div>
            <div className="w-full">
              {/* Seção Acesso à Informação */}
              <TitleMenuSection
                section="acesso"
                label="Acesso à Informação"
                links={linksAcesso}
              />

              {/* Seção Assuntos */}
              <TitleMenuSection
                section="assuntos"
                label="Assuntos"
                links={linksAssuntos}
              />

              {/* Seção Central de Conteúdo */}
              <TitleMenuSection
                section="central"
                label="Central de Conteúdo"
                links={linksCentral}
              />

              {/* Seção Canais de atendimento */}
              <TitleMenuSection
                section="canais"
                label="Canais de atendimento"
                links={linksCanais}
              />

              {/* Seção Composição */}
              <TitleLinkSection
                url="https://www.gov.br/inpe/pt-br/composicao"
                label="Composição"
              />

              {/* Seção Serviços */}
              <TitleLinkSection
                url="https://www.gov.br/inpe/pt-br/servicos"
                label="Serviços"
              />

              <div>
                {activeLinks && (
                  <ul className="my-6">
                    {activeLinks.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.url}
                          className="text-[#c5d4eb] hover:bg-[#263A5D] w-full block px-4 py-2 rounded"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {/* <div className="flex flex-col py-4">
              <a href="#" className="text-white flex items-center"><span className="pr-2"><FaCookieBite /></span> Redefinir Cookies</a>
            </div> */}
            <div className="py-4 flex justify-between">
              <div className="w-full">
                <h2 className="text-lg text-white font-medium uppercase pb-6">
                  Redes sociais
                </h2>
                <div className="flex items-center justify-between w-full">
                  <ul>
                    {linksSocial.map((link, index) => (
                      <li key={index} className="inline-block pr-2">
                        <a
                          href={link.url}
                          className="text-white hover:bg-[#405474] text-2xl w-10 h-10 flex items-center justify-center rounded-full"
                          aria-label={link.label}
                        >
                          <link.icon size={20} />
                        </a>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center">
                    <a
                      href="https://www.gov.br/acessoainformacao/pt-br"
                      className="flex items-center justify-center px-4 py-2 rounded-full hover:bg-[#405473]"
                    >
                      <img src={AcessoInformacao} alt="" className="w-8" />
                      <span className="text-white ml-2">
                        Acesso à informação
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center border-t border-[#7E8A9E]">
            <p className="text-white text-center text-sm p-4">
              <span className="mr-2">Desenvolvido por:</span>
              <a
                href="https://www.cptec.inpe.br/"
                className="font-bold text-xs uppercase hover:bg-[#405474] py-1 px-2 rounded-full"
              >
                CPTEC
              </a>
            </p>
          </div>
        </footer>
      )}
    </>
  );
}
