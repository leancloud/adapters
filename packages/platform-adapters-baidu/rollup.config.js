import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.ts",
  output: {
    dir: "lib",
    format: "cjs",
    sourcemap: true,
  },
  plugins: [
    typescript({
      tsconfig: "tsconfig.build.json",
    }),
    resolve(),
    commonjs(),
  ],
}
