const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const project1HtmlFiles = {
  "index.html": "index.html",
  "korea.html": "korea.html",
  "japan.html": "japan.html",
  "china.html": "china.html",
  "taiwan.html": "taiwan.html",
};

module.exports = {
  mode: "production",

  entry: {
    main: "./src/main.js", // 主入口點
    project_1: "./src/project_1/app.js", // 專案一
    project_2: "./src/project_2/app.js", // 專案二
    snake_game: "./src/snake_game/app.js", // 專案貪吃蛇
  },
  output: {
    filename: (pathData) => {
      return pathData.chunk.name === "main"
        ? "main.js"
        : `${pathData.chunk.name}/app.js`;
    },
    path: path.resolve(__dirname, "dist"),
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.html$/,
        use: ["html-withimg-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      minify: {
        removeAttributeQuotes: true, // 去除引號
        removeComments: true, // 去除注釋
        removeEmptyAttributes: true, // 去除空白
        collapseWhitespace: true, // 去除空格
      },
      chunks: ["main"],
    }),
    ...Object.keys(project1HtmlFiles).map((entryName) => {
      return new HtmlWebpackPlugin({
        filename: `project_1/${entryName}`,
        template: `./src/project_1/${entryName}`,
        minify: {
          removeAttributeQuotes: true, // 去除引號
          removeComments: true, // 去除注釋
          removeEmptyAttributes: true, // 去除空白
          collapseWhitespace: true, // 去除空格
        },
        chunks: ["project_1"],
      });
    }),
    new HtmlWebpackPlugin({
      filename: "project_2/index.html",
      template: "./src/project_2/index.html",
      minify: {
        removeAttributeQuotes: true, // 去除引號
        removeComments: true, // 去除注釋
        removeEmptyAttributes: true, // 去除空白
        collapseWhitespace: true, // 去除空格
      },
      chunks: ["project_2"],
    }),
    new HtmlWebpackPlugin({
      filename: "snake_game/index.html",
      template: "./src/snake_game/index.html",
      minify: {
        removeAttributeQuotes: true, // 去除引號
        removeComments: true, // 去除注釋
        removeEmptyAttributes: true, // 去除空白
        collapseWhitespace: true, // 去除空格
      },
      chunks: ["snake_game"],
    }),

    new MiniCssExtractPlugin({
      filename: (pathData) => {
        return pathData.chunk.name === "main"
          ? "main.css"
          : `${pathData.chunk.name}/styles/style.css`;
      },
      chunkFilename: "[id].css",
    }),
  ],

  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
    minimize: true,
  },
};
