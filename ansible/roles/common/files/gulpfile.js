'use strict';

// 必要なプラグインの読み込み
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var $ = gulpLoadPlugins();  // Gulp プラグインを一括で読み込む

/**
 * CSS を圧縮する
 * 
 * @return {Stream}
 */
gulp.task('min-css', function() {
    return gulp
        .src("css/" + fileName + ".css")  // css/ 配下の指定ファイルを対象に圧縮する
        .pipe($.cleanCss(
        {
            compatibility: 'ie7',   // 互換性の設定
            format: {
                breaks: {
                    afterComment: true  // コメントの後ろに改行を入れる
                }
            }
        }, function(details) {
            // 圧縮結果をログ出力する
            console.log(details.name + ': ' + details.stats.originalSize + ' -> ' + details.stats.minifiedSize);
        }
    ))
    .pipe(rename({
        extname: '.min.css'
    }))
    .pipe(gulp.dest('../dist/css/'));  // dist/css/ 配下に出力する
});

/**
 * SASSをコンパイルする
 * 
 * @return {Stream}
 */
gulp.task('sass', function() {
    return gulp
        .src("sass/" + fileName + ".scss")  // sass/ 配下の指定ファイルを対象にコンパイルする
    .pipe(sass())
    .pipe(rename({
        extname: '.min.css'
    }))
    .pipe(gulp.dest('../dist/css/'));  // dist/css/ 配下に出力する
});

/**
 * JavaScript を圧縮する
 * 
 * @return {Stream}
 */
gulp.task('min-js', function() {
    return gulp
        .src("js/*.js")  // js/ 配下の全ファイルを対象に圧縮する
        .pipe($.plumber())  // エラー時にプロセスが落ちないようにする
        .pipe($.babel())
        .pipe($.uglify({
            compress: true,  // 圧縮する 
            mangle: true,    // 変数の難読化を行う
            output: {
                comments: /^!/  // 「*!」で始まるブロックコメント(ライセンス表記等)を残す
            }
        }))
        .pipe($.rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('../dist/js/'));  // dist/js/ 配下に出力する
});

gulp.task('watch', function () {
    gulp.watch('js/*.js', ['min-js']);
    gulp.watch('sass/*.scss', ['sass']);
    gulp.watch('css/*.css', ['min-css']);
});

gulp.task('default', ['min-js']);
