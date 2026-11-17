import { createContext } from "react";

// Fica fora do ConfigContext.jsx porque o Fast Refresh do Vite só funciona em
// arquivos que exportam apenas componentes (regra react-refresh/only-export-components).
export const ConfigContext = createContext({});
