// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

const stylesHandler = 'style-loader'

const frontendConfig = {
  entry: './src/frontend/index.ts',
  output: {
    path: path.resolve(__dirname, 'frontend_build')
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    })

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/']
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      path.resolve('./node_modules')
    ]
  }
}

const backendConfig = {
  entry: './src/backend/main.ts',
  output: {
    path: path.resolve(__dirname, 'backend_build')
  },
  devtool: 'source-map',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/']
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      path.resolve('./node_modules')
    ]
  }
}

module.exports = () => {
  if (isProduction) {
    frontendConfig.mode = 'production'
  } else {
    frontendConfig.mode = 'development'
  }
  return [
    frontendConfig, backendConfig
  ]
}
