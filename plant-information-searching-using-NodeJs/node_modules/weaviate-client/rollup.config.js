import babel from "@rollup/plugin-babel";

export default {
  input: "index.js",
  output: {
    file: "lib.js",
    format: "umd",
    name: "weaviate-client",
  },
  plugins: [babel({ babelHelpers: "bundled" })],
};
