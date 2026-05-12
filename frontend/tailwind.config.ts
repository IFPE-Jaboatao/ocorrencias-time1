import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/flowbite-react/lib/esm/**/*.js", 
  ],
  theme: {
    extend: {
      colors: {
        iflowGreen: "#15803d", 
      }
    },
  },
  plugins: [
    require("flowbite/plugin"),
  ],
};

export default config;