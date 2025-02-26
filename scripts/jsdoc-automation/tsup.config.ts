import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    //clean: true,
    target: "node20",
   // logErrors: true,
    minify: false,
    minifyWhitespace: false,
    minifySyntax: false,
    minifyIdentifiers: false,
    keepNames: true,
    //watch: true,
    bundle: true,
    platform: "node",
    metafile: true,
    external: ["dotenv"],
    //noExternal: ["dotenv"],
    esbuildOptions: (options) => {
        options.banner = {
            js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
        };
    },
    outDir: "dist",
    treeshake: true,
});
