import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/flowbite-react/lib/esm/**/*.js", // 👈 ESSENCIAL
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("flowbite/plugin"), // 👈 ESSENCIAL
  ],
};

export default config;