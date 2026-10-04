import path from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/

export default defineConfig(() => {
  const rootPath = path.resolve(process.cwd());
  const srcPath = `${rootPath}/src`;

  return {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "~": rootPath,
        "@": srcPath,
      },
    },
  };
});
