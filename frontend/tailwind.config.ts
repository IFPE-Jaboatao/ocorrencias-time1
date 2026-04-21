import type { Config } from "tailwindcss";
import flowbite from "flowbite/plugin"; // <--- 1. Importar o plugin

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/flowbite-react/lib/esm/**/*.js", // <--- 2. Caminho dos componentes
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#5da16f", // Seu verde do Figma
        },
      },
    },
  },
  plugins: [
    flowbite, // <--- 3. Adicionar o plugin aqui
  ],
};

export default config;