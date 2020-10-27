'use strict';

// パッケージ
const { src, dest, series, watch, lastRun, parallel } = require("gulp");
// リネーム機能
const rename = require('gulp-rename');
// EJS コンパイル
const ejs = require('gulp-ejs');
const fs = require('fs');
// HTML 整形
const prettify = require("gulp-prettify");
// Sass / SCSS コンパイル
const sass = require('gulp-sass');
// ベンダープレフィックス付与
const autoPrefixer = require('gulp-autoprefixer');
// TypeScript コンパイル
const typescript = require("gulp-typescript");
// 画像
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
// ローカルサーバ
const connect = require('gulp-connect');
// ブラウザリロード
const browserSync = require('browser-sync').create();
// エラー停止防御 / デスクトップ通知
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
// HTML 圧縮
const htmlmin = require('gulp-htmlmin');
// バンドル用
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");


// ディレクトリ
const PATHS = {
	ejs: {
		src: "./src/ejs/**/!(_)*.ejs",
		_src: "./src/ejs/**/*.ejs", // アンダースコア付きも含める
		dest: "./dist"
	},
	styles: {
		src: "./src/scss/**/!(_)*.scss",
		_src: "./src/scss/**/*.scss",  // アンダースコア付きも含める
		dest: "./dist/css"
	},
	scripts: {
		src: "./src/ts/**/*.ts",
		dest: "./dist/js",
		bundle: "./dist/js/bundle.js"
	},
	image: {
		src: "./src/img/**/*.{jpg,jpeg,png,gif,svg}",
		dest: "./dist/img"
	},
	font: {
		src: "./src/fonts/**",
		dest: "./dist/fonts"
	},
	config: "./src/config.json",
};

// methods
const errorHandler = (err, stats) => {
	if (err || (stats && stats.compilation.errors.length > 0)) {
		const error = err || stats.compilation.errors[0].error;
		notify.onError({ message: "<%= error.message %>" })(error);
		this.emit("end");
	}
}



// EJS コンパイル
const ejsFiles = () => {
	// JSONファイル読み込み
	const json = JSON.parse(fs.readFileSync(PATHS.config));
	return src(PATHS.ejs.src)
		.pipe(plumber({ errorHandler: errorHandler }))
		// .pipe(ejs({}, {}, { ext: ".html" }))
		.pipe(ejs(json, {}, { ext: ".html" }))
		.pipe(rename({ extname: ".html" }))
		.pipe(prettify())
		.pipe(dest(PATHS.ejs.dest));

}

// SCSS コンパイル
const styles = () => {
	return src(PATHS.styles.src)
		.pipe(plumber({ errorHandler: errorHandler }))
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(
			autoPrefixer({
				cascade: false
			})
		)
		.pipe(dest(PATHS.styles.dest));
}

// TypeScript コンパイル
// const ts = () => {
// 	return src(PATHS.scripts.src)
// 		.pipe(plumber({ errorHandler: errorHandler }))
// 		.pipe(
// 			typescript({
// 				target: "ES6"
// 			})
// 		)
// 		.js.pipe(dest(PATHS.scripts.dest));
// }

// images
const image = () => {
	return src(PATHS.image.src)
		.pipe(plumber({ errorHandler: errorHandler }))
		.pipe(changed(PATHS.image.dest))
		.pipe(imagemin([
			pngquant({
				quality: [0.65, 0.80],
				speed: 1,
				floyd: 0,
			}),
			mozjpeg({
				quality: 85,
				progressive: true
			}),
			imagemin.svgo(),
			imagemin.optipng(),
			imagemin.gifsicle()
		]))
		.pipe(dest(PATHS.image.dest))
}

// font
const font = () => {
	return src(PATHS.font.src)
		.pipe(plumber({ errorHandler: errorHandler }))
		.pipe(dest(PATHS.font.dest))
}

// バンドル
const bundle = () => {
	return webpackStream(webpackConfig, webpack)
		.pipe(plumber({ errorHandler: errorHandler }))
		.pipe(dest(PATHS.scripts.dest));
};

// ファイルの変更を監視
// watch
const watchFiles = done => {
	watch(PATHS.config, series(reload));

	watch(PATHS.ejs._src, series(ejsFiles, minifyHTML, reload));
	watch(PATHS.styles._src, series(styles, reload));

	watch(PATHS.image.src, series(image, reload));

	watch(PATHS.scripts.src, series(bundle));
	watch(PATHS.scripts.bundle, series(reload));

	watch(PATHS.font.src, series(font, reload));
	done();
}

// ローカルサーバ設定
// server
const browserSyncOption = {
	open: false,
	port: 3000,
	ui: {
		port: 3001
	},
	server: {
		baseDir: PATHS.ejs.dest, // output directory,
		index: "index.html"
	}
};
const server = done => {
	browserSync.init(browserSyncOption);
	done();
}

// browser reload
const reload = done => {
	browserSync.reload();
	done();
	console.info("Browser reload completed");
}


// HTML 圧縮
const minifyHTML = () => {
	return src(PATHS.ejs.dest + '/**/*.html')
		.pipe(htmlmin({
			// 余白を除去する
			collapseWhitespace: true,
			// HTMLコメントを除去する
			removeComments: true
		}))
		.pipe(dest(PATHS.ejs.dest))
}

// commands
exports.default = series(
	parallel(bundle, ejsFiles, styles, image, font),
	parallel(minifyHTML), // minify task
	series(server, watchFiles)
);
exports.image = series(
	image
);
exports.production = series(
	parallel(bundle, ejsFiles, styles, image, font),  // コンパイル task
	parallel(minifyHTML) // minify task
);
