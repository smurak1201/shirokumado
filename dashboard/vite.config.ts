import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tsconfigPaths()],
    define: {
      'import.meta.env.VITE_APP_URL': JSON.stringify(env.APP_URL),
      'import.meta.env.VITE_APP_NAME': JSON.stringify(env.APP_NAME),
    },
  };
});
