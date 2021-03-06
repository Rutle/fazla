const lodash = require('lodash');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');

function srcPaths(src) {
  return path.join(__dirname, src);
}

const isEnvProduction = process.env.NODE_ENV === 'production';
const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isWeb = process.env.PLAT_ENV === 'web';
const isElectron = process.env.PLAT_ENV === 'electron';

// #region Common settings
const commonConfig = {
  devtool: isEnvDevelopment ? 'source-map' : false,
  mode: isEnvProduction ? 'production' : 'development',
  output: { path: srcPaths('dist') },
  node: { __dirname: false, __filename: false },
  resolve: {
    alias: {
      _: srcPaths('src'),
      _main: srcPaths('src/main'),
      _models: srcPaths('src/models'),
      _public: srcPaths('public'),
      _renderer: srcPaths('src/renderer'),
      _utils: srcPaths('src/utils'),
      _reducers: srcPaths('src/reducers'),
      _components: srcPaths('src/components'),
      _hooks: srcPaths('src/hooks'),
    },
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: 'url-loader',
        },
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.(scss|css)$/,
        use: [
          isEnvDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.(jpg|png|svg|ico|icns)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
    ],
  },
};

// #endregion
if (isElectron) {
  const mainConfig = lodash.cloneDeep(commonConfig);

  mainConfig.entry = './src/main/electron.ts';
  mainConfig.target = 'electron-main';
  mainConfig.output.filename = 'main.bundle.js';
  mainConfig.plugins = [
    new CopyPlugin({
      patterns: [
        {
          from: 'package.json',
          to: 'package.json',
          transform: (content, _path) => { // eslint-disable-line no-unused-vars
            const jsonContent = JSON.parse(content);

            delete jsonContent.devDependencies;
            delete jsonContent.scripts;
            delete jsonContent.build;

            jsonContent.main = './main.bundle.js';
            jsonContent.scripts = { start: 'electron ./main.bundle.js' };
            jsonContent.postinstall = 'electron-builder install-app-deps';

            return JSON.stringify(jsonContent, undefined, 2);
          },
        },
      ],
    }),
  ];

  const preloadConfig = lodash.cloneDeep(commonConfig);
  preloadConfig.entry = './src/main/preload.ts';
  preloadConfig.target = 'electron-preload';
  preloadConfig.output.filename = 'preload.bundle.js';

  const rendererConfig = lodash.cloneDeep(commonConfig);
  rendererConfig.entry = './src/renderer/index.tsx';
  rendererConfig.target = 'electron-renderer';
  rendererConfig.output.filename = 'renderer.bundle.js';
  rendererConfig.plugins = [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
      inject: true,
      hash: true,
    }),
    new webpack.DefinePlugin({
      'process.env.PLAT_ENV': JSON.stringify(process.env.PLAT_ENV),
    }),
  ];
  if (!isEnvDevelopment) {
    // enable in production only
    rendererConfig.plugins.push(new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }));
  }
  module.exports = [mainConfig, preloadConfig, rendererConfig];
}
if (isWeb) {
  const webConfig = lodash.cloneDeep(commonConfig);
  webConfig.entry = {
    renderer: ['./src/renderer/index.tsx'],
  };
  webConfig.output = {
    filename: 'static/js/[name].[contenthash:8].js',
    clean: true,
  };
  webConfig.performance = {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  };
  webConfig.optimization = {
    minimize: isEnvProduction,
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'node_vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
        },
      },
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },

  };
  webConfig.plugins = [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
      favicon: path.resolve(__dirname, './public/favicon.ico'),
      // inject: true,
      // hash: true,
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public/manifest.json' },
        { from: 'public/robots.txt' },
        { from: 'public/logo192.png' },
        { from: 'public/logo512.png' },
      ],
    }),
    new webpack.DefinePlugin({
      'process.env.PLAT_ENV': JSON.stringify(process.env.PLAT_ENV),
    }),
    // new BundleAnalyzerPlugin(),
  ];
  if (!isEnvDevelopment) {
    // enable in production only
    webConfig.plugins.push(new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }));
  }

  module.exports = [webConfig];
}
