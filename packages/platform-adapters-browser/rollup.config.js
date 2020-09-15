import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: [
    {
      dir: "lib",
      format: "cjs",
      sourcemap: true,
      entryFileNames: "[name].[format].js",
    },
    {
      dir: "lib",
      format: "esm",
      sourcemap: true,
      entryFileNames: "[name].[format].js",
    }
  ],
  plugins: [
    typescript({
      tsconfig: "tsconfig.build.json",
    }),
  ],
};
