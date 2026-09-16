import { useState, useRef, useEffect } from "react";

export default function ComboBox({
  cities,
  selectedCity,
  setSelectedCity,
  onCitySelected, // Nova função para emitir o id da cidade selecionada
  setIsInputFocused,
  inputId = "city",
}) {
  const [filteredCities, setFilteredCities] = useState(cities);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const comboBoxRef = useRef(null);
  const listboxId = `${inputId}-listbox`;

  useEffect(() => {
    setFilteredCities(cities);
    setActiveIndex(-1);
  }, [cities]);

  const classSelect =
    "py-2 px-2 block w-full border border-gray-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none";

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSelectedCity(query);

    // Filtra as cidades pelo nome
    const filtered = cities.filter((city) =>
      city.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCities(filtered);
    setActiveIndex(-1);
    setIsOpen(true); // Abre a lista suspensa
  };

  const handleCityClick = (city) => {
    setSelectedCity(`${city.name} - ${city.uf}`);
    setIsOpen(false); // Fecha a lista suspensa após selecionar
    setActiveIndex(-1);
    onCitySelected(city.id); // Chama a função ao selecionar a cidade
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((currentIndex) =>
        filteredCities.length === 0
          ? -1
          : Math.min(currentIndex + 1, filteredCities.length - 1)
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((currentIndex) =>
        filteredCities.length === 0
          ? -1
          : currentIndex < 0
          ? filteredCities.length - 1
          : Math.max(currentIndex - 1, 0)
      );
      return;
    }

    if (event.key === "Enter" && isOpen && activeIndex >= 0) {
      const activeCity = filteredCities[activeIndex];
      if (activeCity) {
        event.preventDefault();
        handleCityClick(activeCity);
      }
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  // Fechar a lista ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (comboBoxRef.current && !comboBoxRef.current.contains(event.target)) {
        setIsOpen(false); // Fecha a lista se clicar fora
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [comboBoxRef]);

  // console.log("selectedCity", selectedCity);

  return (
    <div ref={comboBoxRef}>
      <input
        id={inputId}
        name={inputId}
        type="text"
        value={selectedCity}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          setIsOpen(true);
          setIsInputFocused(true);
          // console.log("isInputFocused", true);
        }} // Abre a lista suspensa ao focar no input
        onBlur={() => {
          setIsInputFocused(false);
          // console.log("isInputFocused", false);
        }}
        className={classSelect}
        autoComplete="off"
        placeholder="Digite a cidade..."
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={
          activeIndex >= 0
            ? `${inputId}-option-${filteredCities[activeIndex]?.id}`
            : undefined
        }
      />

      {isOpen && filteredCities.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-10 w-[calc(100%-30px)] bg-white border border-gray-300 rounded-md max-h-48 overflow-auto"
        >
          {filteredCities.map((city, index) => (
            <li
              key={city.id}
              id={`${inputId}-option-${city.id}`}
              role="option"
              tabIndex={-1}
              aria-selected={index === activeIndex}
              className={`cursor-pointer px-2 py-2 text-sm hover:bg-indigo-500 hover:text-white ${
                index === activeIndex ? "bg-indigo-500 text-white" : ""
              }`}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => handleCityClick(city)}
            >
              {city.name} - {city.uf}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
