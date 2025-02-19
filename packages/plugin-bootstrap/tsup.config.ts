import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "dist",
    sourcemap: true,
    clean: true,
  format: ["esm"], // Ensure you're targeting CommonJS
  platform: "node",
  target: "node18",
  bundle: true,
  splitting: true, // Add this for better code splitting
  dts: true, // Generate declaration files
    external: [
        "dotenv", // Externalize dotenv to prevent bundling
        "fs", // Externalize fs to use Node.js built-in module
        "path", // Externalize other built-ins if necessary
        "@reflink/reflink",
      "@node-llama-cpp", // FIXME remove this
        "https",
        "http",
        "agentkeepalive",
        // Add other modules you want to externalize
    ],
});
