"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var mincss = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var server = require("browser-sync").create();

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sass())
    .pipe(gulp.dest("source/css"))
    .pipe(mincss())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("start", gulp.series("css", "server"));

gulp.task("image", function () {
  return gulp.src("source/img/**/*.{jpg, png, svg}")
    .pipe(imagemin([
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{jpg, png}")
    .pipe(webp({quality: 50}))
    .pipe(gulp.dest("source/img"));
});


