const {src, dest, series, watch} = require('gulp');

const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('sass');
const gulpSass = require('gulp-sass');
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const fileInclude = require('gulp-file-include');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const revDel = require('gulp-rev-delete-original');
const htmlmin = require('gulp-htmlmin');
const gulpif = require('gulp-if');
const notify = require('gulp-notify');
const image = require('gulp-imagemin');
const {
  readFileSync
} = require('fs');
const typograf = require('gulp-typograf');
const webp = require('gulp-webp');
const mainSass = gulpSass(sass);
const webpackStream = require('webpack-stream');
const plumber = require('gulp-plumber');
const path = require('path');
const zip = require('gulp-zip');
const rootFolder = path.basename(path.resolve());


let isProd = false; // dev by default

function clean() {
  return del(['./app'])
}

//svg sprite
function svgSprites() {
  return src('./src/img/svg/**.svg')
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          $('[fill]').removeAttr('fill');
          $('[stroke]').removeAttr('stroke');
          $('[style]').removeAttr('style');
        },
        parserOptions: {
          xmlMode: true
        },
      })
    )
    .pipe(replace('&gt;', '>'))
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      },
    }))
    .pipe(dest('./app/img'));
}

// scss styles
function styles() {
  return src('./src/scss/**/*.scss', { sourcemaps: !isProd })
    .pipe(plumber(
      notify.onError({
        title: "SCSS",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(mainSass())
    .pipe(autoprefixer({
      cascade: false,
      grid: true,
      overrideBrowserslist: ["last 5 versions"]
    }))
    .pipe(gulpif(isProd, cleanCSS({
      level: 2
    })))
    .pipe(dest('./app/css', { sourcemaps: '.' }))
    .pipe(browserSync.stream());
};

// styles backend
function stylesBackend() {
  return src('./src/scss/**/*.scss')
    .pipe(plumber(
      notify.onError({
        title: "SCSS",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(mainSass())
    .pipe(autoprefixer({
      cascade: false,
      grid: true,
      overrideBrowserslist: ["last 5 versions"]
    }))
    .pipe(dest('./app/css'))
    .pipe(browserSync.stream());
};

// scripts
function scripts() {
  return src('./src/js/main.js')
    .pipe(plumber(
      notify.onError({
        title: "JS",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(webpackStream({
      mode: isProd ? 'production' : 'development',
      output: {
        filename: 'main.js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: "defaults"
                }]
              ]
            }
          }
        }]
      },
      devtool: !isProd ? 'source-map' : false
    }))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end');
    })
    .pipe(dest('./app/js'))
    .pipe(browserSync.stream());
}

// scripts backend
function scriptsBackend() {
  return src('./src/js/main.js')
    .pipe(plumber(
      notify.onError({
        title: "JS",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(webpackStream({
      mode: 'development',
      output: {
        filename: 'main.js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: "defaults"
                }]
              ]
            }
          }
        }]
      },
      devtool: false
    }))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end');
    })
    .pipe(dest(paths.buildJsFolder))
    .pipe(browserSync.stream());
}

function resources() {
  return src('./src/resources/**')
    .pipe(dest('./app'))
}

function images() {
  return src(['./src/img/**/**.{jpg,jpeg,png,svg}'])
    .pipe(gulpif(isProd, image([
      image.mozjpeg({
        quality: 80,
        progressive: true
      }),
      image.optipng({
        optimizationLevel: 2
      }),
    ])))
    .pipe(dest('./app/img'))
}

function webpImages() {
  return src(['./src/img/**/**.{jpg,jpeg,png}'])
    .pipe(webp())
    .pipe(dest('./app/img'))
}

function htmlInclude() {
  return src(['./src/*.html'])
    .pipe(fileInclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(typograf({
      locale: ['ru', 'en-US']
    }))
    .pipe(dest('./app'))
    .pipe(browserSync.stream());
}

function watchFiles() {
  browserSync.init({
    server: {
      baseDir: './app'
    },
  });

  watch('./src/scss/**/*.scss', styles);
  watch('./src/js/**/*.js', scripts);
  watch('./src/partials/*.html', htmlInclude);
  watch('./src/*.html', htmlInclude);
  watch('./src/resources/**', resources);
  watch('./src/img/**/**.{jpg,jpeg,png,svg}', images);
  watch('./src/img/**/**.{jpg,jpeg,png}', webpImages);
  watch('./src/img/svg/**.svg', svgSprites);
}

function cache() {
  return src('./app/**/*.{css,js,svg,png,jpg,jpeg,webp,woff2}', {
      base: './app'
    })
    .pipe(rev())
    .pipe(revDel())
    .pipe(dest('./app'))
    .pipe(rev.manifest('rev.json'))
    .pipe(dest('./app'));
};

function rewrite() {
  const manifest = readFileSync('app/rev.json');
  src('./app/css/*.css')
    .pipe(revRewrite({
      manifest
    }))
    .pipe(dest('./app/css/*.css'));
  return src('./app/**/*.html')
    .pipe(revRewrite({
      manifest
    }))
    .pipe(dest('./app'));
}

function htmlMinify() {
  return src('./app/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('./app'));
}

const zipFiles = (done) => {
  del.sync(['./app/*.zip']);
  return src('./app/**/*.*', {})
    .pipe(plumber(
      notify.onError({
        title: "ZIP",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(zip(`${rootFolder}.zip`))
    .pipe(dest('./app'));
}

const toProd = (done) => {
  isProd = true;
  done();
};

exports.default = series(clean, htmlInclude, scripts, styles, resources, images, webpImages, svgSprites, watchFiles);

exports.backend = series(clean, htmlInclude, scriptsBackend, stylesBackend, resources, images, webpImages, svgSprites)

exports.build = series(toProd, clean, htmlInclude, scripts, styles, resources, images, webpImages, svgSprites, htmlMinify);

exports.cache = series(cache, rewrite);

exports.zip = zipFiles;
