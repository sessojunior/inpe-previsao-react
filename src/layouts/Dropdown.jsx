import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function Dropdown({ label, subitems, isFullWidth }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Função para fechar o dropdown ao clicar fora
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // Adiciona e remove o listener de clique fora
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup ao desmontar o componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`${label} Menu`}
        className="flex items-center justify-between w-full hover:bg-[#D9E3F2] py-2 px-3 rounded focus:outline-none transition duration-200"
      >
        {label}
        <FaChevronDown size={12} className="ml-1" />
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 ${
            isFullWidth ? "w-full" : "w-64"
          } mt-2 bg-white border border-gray-300 rounded shadow-lg z-50 transition ease-out duration-100 transform`}
        >
          <nav>
            <ul className="flex flex-col">
              {subitems.map((subitem, index) => (
                <li key={index}>
                  <a
                    href={subitem.url}
                    className="block hover:bg-[#D9E3F2] py-2 px-3 border-b border-[#CCCCCC] transition duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {subitem.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
