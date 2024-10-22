import { useState, useRef, useEffect } from "react";

export default function ComboBox({
  cities,
  selectedCity,
  setSelectedCity,
  onCitySelected, // Nova função para emitir o id da cidade selecionada
  isInputFocused,
  setIsInputFocused,
}) {
  const [filteredCities, setFilteredCities] = useState(cities);
  const [isOpen, setIsOpen] = useState(false);
  const comboBoxRef = useRef(null);

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
    setIsOpen(true); // Abre a lista suspensa
  };

  const handleCityClick = (city) => {
    setSelectedCity(`${city.name} - ${city.uf}`);
    setIsOpen(false); // Fecha a lista suspensa após selecionar
    onCitySelected(city.id); // Chama a função ao selecionar a cidade
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
        id="city"
        name="city"
        type="text"
        value={selectedCity}
        onChange={handleInputChange}
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
      />

      {isOpen && filteredCities.length > 0 && (
        <ul className="absolute z-10 w-[calc(100%-30px)] bg-white border border-gray-300 rounded-md max-h-48 overflow-auto">
          {filteredCities.map((city) => (
            <li
              key={city.id}
              className="cursor-pointer px-2 py-2 text-sm hover:bg-indigo-500 hover:text-white"
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
