import { useContext, useState, useRef, useEffect } from "react";
import { ConfigContext } from "../contexts/ConfigContext";

import imgLogo from "../assets/govbr-logo.png";
import { FaEllipsisV, FaBars } from "react-icons/fa";

import Dropdown from "./Dropdown";

export default function Header() {
  const { config } = useContext(ConfigContext);
  const [isTopMenuOpen, setIsTopMenuOpen] = useState(false); // Para menu superior em telas pequenas
  const [isBottomNavOpen, setIsBottomNavOpen] = useState(false); // Para menu inferior em telas pequenas

  // Referências para os menus
  const topMenuRef = useRef(null);
  const bottomNavRef = useRef(null);

  const linksTop = [
    {
      label: "Órgãos do governo",
      url: "https://www.gov.br/pt-br/orgaos-do-governo",
    },
    {
      label: "Acesso à Informação",
      url: "https://www.gov.br/acessoainformacao/pt-br",
    },
    { label: "Legislação", url: "http://www4.planalto.gov.br/legislacao" },
    {
      label: "Acessibilidade",
      url: "https://www.gov.br/governodigital/pt-br/acessibilidade-digital",
      // subitems: [ /* opcional */ ],
    },
  ];

  const linksBottom = [
    { label: "CPTEC", url: "https://www.cptec.inpe.br/" },
    {
      label: "Previsão Numérica",
      url: "http://previsaonumerica.cptec.inpe.br/",
      subitems: [
        {
          label: "Previsão Numérica de Tempo",
          url: "http://previsaonumerica.cptec.inpe.br/",
        },
        {
          label: "Previsão Numérica Subsazonal",
          url: "https://subsazonal.cptec.inpe.br/",
        },
        {
          label: "Previsão Numérica Sazonal",
          url: "https://sazonal.cptec.inpe.br/",
        },
      ],
    },
    { label: "Clima", url: "http://clima.cptec.inpe.br/" },
    { label: "Nowcasting", url: "https://nowcasting.cptec.inpe.br/" },
    {
      label: "Satélite",
      url: "http://satelite.cptec.inpe.br/home/novoSite/index.jsp",
    },
    { label: "Ondas", url: "http://ondas.cptec.inpe.br/" },
    {
      label: "Bacias",
      url: "https://bacias.cptec.inpe.br/",
    },
    { label: "Qualidade do Ar", url: "http://meioambiente.cptec.inpe.br/" },
    {
      label: "Pós Graduação",
      url: "https://www.gov.br/inpe/pt-br/area-conhecimento/posgraduacao/",
    },
    // Você pode adicionar mais links conforme necessário
  ];

  // Função para lidar com cliques fora dos menus
  const handleClickOutside = (event) => {
    // Fecha o menu superior se o clique for fora
    if (topMenuRef.current && !topMenuRef.current.contains(event.target)) {
      setIsTopMenuOpen(false);
    }

    // Fecha o menu inferior responsivo se o clique for fora
    if (bottomNavRef.current && !bottomNavRef.current.contains(event.target)) {
      setIsBottomNavOpen(false);
    }
  };

  useEffect(() => {
    if (isTopMenuOpen || isBottomNavOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup para remover o listener quando o componente for desmontado
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTopMenuOpen, isBottomNavOpen]);

  return (
    <>
      {config.showHeaderFooter && (
        <header className="bg-white w-full p-4 xl:max-w-[1280px] xl:mx-auto">
          {/* Parte Superior do Header */}
          <div className="flex justify-between mb-3 h-10">
            <div className="flex items-center">
              <div>
                <a href="https://www.gov.br/pt-br">
                  <img
                    src={imgLogo}
                    alt="Logo"
                    className="h-8 hover:bg-[#D9E3F3]"
                  />
                </a>
              </div>
              <div className="flex items-center">
                <span className="pl-2 ml-2 border-l-2 border-l-gray-400 text-md font-thin">
                  Ministério da Ciência, Tecnologia e Inovação
                </span>
              </div>
            </div>
            <div className="flex items-center relative" ref={topMenuRef}>
              {/* Navegação para telas grandes */}
              <div className="hidden lg:flex space-x-4">
                {linksTop.map((link, index) => (
                  <div key={index}>
                    {link.subitems ? (
                      <Dropdown label={link.label} subitems={link.subitems} />
                    ) : (
                      <a
                        href={link.url}
                        className="text-[#1351b4] font-thin hover:bg-[#D9E3F3] rounded"
                      >
                        {link.label}
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {/* Ícone de Menu para telas pequenas (FaEllipsisV) */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsTopMenuOpen(!isTopMenuOpen)}
                  aria-label="Menu"
                  className={`text-2xl focus:outline-none hover:bg-[#D9E3F3] hover:text-[#1351b4] h-8 w-8 rounded-full flex justify-center items-center ${
                    isTopMenuOpen ? "bg-[#0E3C83] text-white" : "text-[#1351b4]"
                  }`}
                >
                  <FaEllipsisV size={14} />
                </button>

                {/* Menu Dropdown para telas pequenas */}
                {isTopMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-300 rounded shadow-lg z-50">
                    <h3 className="px-3 py-2 font-medium">Acesso Rápido</h3>
                    <nav>
                      <ul className="flex flex-col">
                        {linksTop.map((link, index) => (
                          <li key={index}>
                            {link.subitems ? (
                              <Dropdown
                                label={link.label}
                                subitems={link.subitems}
                              />
                            ) : (
                              <a
                                href={link.url}
                                className="block text-sm font-thin hover:bg-[#D9E3F3] px-3 py-2 border-b border-[#CCCCCC]"
                                onClick={() => setIsTopMenuOpen(false)} // Fecha o menu ao clicar
                              >
                                {link.label}
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Parte do Centro do Header */}
          <div className="flex justify-between mb-3">
            <div className="flex flex-col">
              <div className="text-xl md:text-2xl">
                Centro de Previsão de Tempo e Estudos Climáticos
              </div>
              <div className="text-xl md:text-2xl hidden md:flex">CPTEC</div>
            </div>
          </div>

          {/* Navegação Inferior */}
          <div className="flex justify-between items-center mt-6">
            {/* Navegação Inferior para Telas Grandes */}
            <div className="hidden lg:flex" ref={bottomNavRef}>
              <nav>
                <ul className="flex">
                  {linksBottom.map((link, index) => (
                    <li key={index}>
                      {link.subitems ? (
                        <Dropdown label={link.label} subitems={link.subitems} />
                      ) : (
                        <a
                          href={link.url}
                          className="inline-block hover:bg-[#D9E3F2] py-2 px-3 rounded"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Ícone de Menu para Telas Pequenas (FaBars/FaTimes) */}
            <div className="lg:hidden relative w-full" ref={bottomNavRef}>
              <button
                onClick={() => setIsBottomNavOpen(!isBottomNavOpen)}
                aria-label="Menu Inferior"
                className={`text-2xl focus:outline-none hover:bg-[#D9E3F3] hover:text-´[#0E3C84] border border-[#D9D9D9] rounded h-10 w-10 flex justify-center items-center ${
                  isBottomNavOpen ? "bg-[#0E3C84] text-white" : ""
                }`}
              >
                <FaBars size={20} />
              </button>

              {/* Menu Inferior para Telas Pequenas */}
              {isBottomNavOpen && (
                <div className="mt-2 w-full bg-white border-gray-300 rounded z-50">
                  <nav>
                    <ul className="flex flex-col">
                      {linksBottom.map((link, index) => (
                        <li key={index}>
                          {link.subitems ? (
                            <Dropdown
                              label={link.label}
                              subitems={link.subitems}
                              isFullWidth={true} // Passando a prop para ocupar largura total
                            />
                          ) : (
                            <a
                              href={link.url}
                              className="block hover:bg-[#D9E3F2] py-2 px-3 rounded"
                              onClick={() => setIsBottomNavOpen(false)} // Fecha o menu ao clicar
                            >
                              {link.label}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </header>
      )}
    </>
  );
}
