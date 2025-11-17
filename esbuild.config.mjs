import esbuild from "esbuild";

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    outfile: "dist/bundle.js",
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node20",
    minify: true,
    sourcemap: false,
    external: [],
    loader: {
      ".png": "dataurl",
    },
  })
  .catch(() => process.exit(1));
