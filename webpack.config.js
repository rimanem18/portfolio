const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	// mode: 'production', // 本番用（圧縮される）
	mode: 'development', // 開発用（圧縮されない）
	entry: './src/ts/index.ts', // バンドル前のエントリポイント
	output: { // バンドル先
		filename: 'bundle.js',
		path: path.join(__dirname, 'dist/js')
	},
	module: {
		rules: [
		  {
			// 拡張子 .ts の場合
			test: /\.ts$/,
			// TypeScript をコンパイルする
			use: 'ts-loader',
		  },
		],
	  },
	  resolve: {
		// 拡張子を配列で指定
		extensions: [
		  '.ts', '.js',
		],
	  },
	  optimization: {
		minimize: true,
		minimizer: [new TerserPlugin({
			terserOptions: {
				ecma: 6,
				compress: { drop_console: true },
				output: {
					comments: false,
					beautify: false
				}
			}
		})]
	}
};