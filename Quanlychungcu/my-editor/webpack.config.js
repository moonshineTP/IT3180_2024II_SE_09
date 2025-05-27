
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Thêm dòng này

module.exports = {
  mode: 'production',
  entry: './src/ckeditor.js',

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'ckeditor.js',
    library: {
      type: 'module'
    }
  },

  experiments: { outputModule: true },

  // Thêm plugins section
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css' // Tên file CSS đầu ra
    })
  ],

  module: {
    rules: [
      { 
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // Thay thế style-loader bằng này
          'css-loader',
          'postcss-loader'
        ]
      },
      { 
        test: /\.svg$/, 
        use: ['raw-loader'] 
      }
    ]
  }
};

