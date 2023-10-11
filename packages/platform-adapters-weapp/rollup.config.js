import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import strip from "@rollup/plugin-strip";

export default {
  input: "src/index.ts",
  output: {
    dir: "lib",
    format: "cjs",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    typescript({
      tsconfig: "tsconfig.build.json",
    }),
    strip({
      include: ["**/*.(js|mjs|ts)"],
      // Weixin mini program does not support console.assert :(
      // Link: https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/console.html
      functions: ["console.assert"],
    }),
  ],
};
