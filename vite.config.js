import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/inpe-previsao-react",
  server: {
    host: true,
    allowedHosts: ["localhost", "test.cptec.inpe.br"],
  },
});
