import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

const base = (process.env.BASENAME ?? "") + "/";

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
});
