import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

/**
 * @type {import('@rollup/plugin-babel').RollupBabelInputPluginOptions}
 */
const babelConfig = {
  babelHelpers: "bundled",
  extensions: [".js", ".ts"],
  presets: ["@babel/preset-typescript"],
};

const commonPlugins = [nodeResolve({ browser: true }), commonjs(), babel(babelConfig)];

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  {
    input: "./src/index.ts",
    output: {
      format: "esm",
      sourcemap: true,
      file: "./dist/newcar.js",
    },
    plugins: [typescript(), ...commonPlugins],
    treeshake: true,
  },
  {
    input: "./src/index.ts",
    output: {
      format: "esm",
      sourcemap: true,
      file: "./dist/newcar.min.js",
    },
    plugins: [typescript(), ...commonPlugins, terser({ ecma: 2015 })],
    treeshake: true,
  },
  {
    input: "./dist/src/index.d.ts",
    output: {
      file: "./dist/newcar.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
];
