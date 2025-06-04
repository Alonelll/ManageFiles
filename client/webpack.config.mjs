import { resolve as absolutePathResolve } from "path";

function pathResolve(relpath) {
  return absolutePathResolve(process.cwd(), relpath);
}

export default {
  entry: pathResolve("src/index.tsx"),

  output: {
    path: pathResolve("build"),
    filename: "bundle.js",
    publicPath: "/",
    clean: true,
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".css"],
    alias: {
      "@util": pathResolve("src/util"),
      "@modules": pathResolve("src/modules"),
      "@root": pathResolve("src/root.ts"),
      "@style": pathResolve("src/style"),
      "#src": pathResolve("src"),
    },
  },

  mode: "development",

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },

  devServer: {
    static: {
      directory: pathResolve("public"),
      serveIndex: false,
    },
    hot: true,
    historyApiFallback: true,
    port: 3000,
  },
};
