import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.ts",
  output: {
    dir: "lib",
    format: "esm",
    sourcemap: true,
  },
  plugins: [
    typescript({
      tsconfig: "tsconfig.build.json",
    }),
    resolve(),
  ],
}
