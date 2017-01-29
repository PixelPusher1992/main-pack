"use strict";

const gulp = require('gulp');

/** CSS **/
const autoprefixer = require('gulp-autoprefixer');        //adding vendor prefixes
const csso = require('gulp-csso');                        //creating min.css files
const sass = require('gulp-sass');                        //making css from scss
const sourcemaps = require('gulp-sourcemaps');            //sourcemaps generating
const uncss = require('gulp-uncss');                      //delete unused css
const urlAdjuster = require('gulp-css-url-adjuster-cc');  //changing url's in css

/** IMAGES **/
const imagemin = require('gulp-imagemin');                //minify PNG, JPEG, GIF and SVG
const tinypng = require('gulp-tinypng');                  //minify better then imagemin, but needs payment
const spritesmith = require('gulp.spritesmith');          //making sprites

/** JS **/
const babel = require('gulp-babel');                      //making ES5 from ES6
const uglify = require('gulp-uglify');                    //creating min.js files

/** Other **/
const concat = require('gulp-concat');                    //combining few files to one
const browserSync = require('browser-sync').create();     //adding auto-reload to browser
const fs = require('fs');                                 //needs to use npm file system
const rename = require("gulp-rename");                    //renaming files



/** PATHS **/
/* source paths */
const source = {
    css: 'src/css/',
    js: 'src/js/',
    img: 'src/img/'
};

/* dist paths */
const dist = {
    js: 'dist/js/',
    css: 'dist/css/',
    img: 'dist/img/',
    fonts: 'dist/fonts/'
};

/* additional paths */
const path = {
    css: {
        animations: `${source.css}animations.scss`,
        fonts: `${source.css}font-faces.scss`,
        imports: `${source.css}imports.scss`,
        mixins: `${source.css}mixims.scss`,
        sprite: `${source.css}sprite.scss`,
        style: `${source.css}style.scss`,
        variables: `${source.css}variables.scss`,
        full: `${source.css}**`,
        components: `${source.css}components/*.scss`,
        bootstrap: 'bower_components/bootstrap-sass/assets/stylesheets/',
        fancyBox: 'bower_components/fancyBox/source/**/*.css',
        awesomescss: 'bower_components/font-awesome/css/font-awesome.min.css',
        animate: 'bower_components/animate.css/animate.min.css'
    },
    js: {
        main: `${source.js}main.js`,
        jquery: `${source.js}jquery.min.js`,
        bootstrap: `${source.js}bootstrap.min.js`,
        fancyBox: `${source.js}jquery.fancybox.pack.js`
    },
    fonts: {
        fontawesome: 'bower_components/font-awesome/fonts/**',
        bootstrap: 'bower_components/bootstrap-sass/assets/fonts/**'
    },
    images: {
        main: `${source.img}*.{jpg,png}`,
        fancyBox: 'bower_components/fancyBox/source/*.{png,gif}',
        sprite: `${source.img}sprite/*`
    }
};

/* paths groups */
const cssSrc = [path.css.components, path.css.full];
const jsSrc = [path.js.jquery, path.js.bootstrap, path.js.fancyBox];
const imgSrc = [path.images.main, path.images.sprite];



/** IF ERROR **/
function errorLog(error) {
    console.log(error);
    this.emit('end');
}



/** CSS TASKS **/

/* main task */
gulp.task('css', () => {
    gulp.src(path.css.style, { base: '.' })
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', errorLog)
        .pipe(autoprefixer({ browsers: ['defaults', 'ie >= 9', 'last 15 versions'] }))
        .pipe(concat({path: 'style.min.css', cwd: ''}))
        .pipe(csso())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dist.css))
        .pipe(browserSync.stream());
});

/* delete unused styles */
gulp.task('css:uncss', () => {
    gulp.src(`${dist.css}/style.min.css`)
        .pipe(uncss({
            html: ['http://js30/lesson_1/']
        }))
        .pipe(gulp.dest(dist.css));
});



/** JS **/

/* use js libraries */
gulp.task('js:libs', () => {
    setTimeout( () => {
        gulp.src(jsSrc)
            .pipe(sourcemaps.init())
            .pipe(concat({path: 'lib.min.js', cwd: ''}))
            .pipe(uglify())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(dist.js))
            .pipe(browserSync.stream());
    }, 5000);
});

/* main task */
gulp.task('js', () => {
    gulp.src(path.js.main)
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(concat({path: 'main.min.js', cwd: ''}))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dist.js))
        .pipe(browserSync.stream());
});



/** IMAGES **/

/* minify images */
gulp.task('img:min', () => {
    gulp.src(path.images.main)
        .pipe(imagemin())
        .pipe(gulp.dest(dist.img));
    gulp.src(path.images.sprite)
        .pipe(imagemin())
        .pipe(gulp.dest(`${source.img}sprite/`));
});

/* minify images with tiny */
gulp.task('img:tiny', () => {
    gulp.src(path.images.main)
        .pipe(tinypng('wyABEqRuQ6xYKlUKOUjBfLqtWGJVejyE'))
        .pipe(gulp.dest(dist.img));
    gulp.src(path.images.sprite)
        .pipe(tinypng('wyABEqRuQ6xYKlUKOUjBfLqtWGJVejyE'))
        .pipe(gulp.dest(`${source.img}sprite/`));
});

/* make sprite png */
gulp.task('img:sprite-png', () => {
    let spriteDataPng =
        gulp.src(`${path.images.sprite}*.png`)
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'style-png.css',
                imgPath: '../img/sprite/sprite.png'
            }));
    spriteDataPng.pipe(gulp.dest(`${dist.img}sprite/`));
});

/* make sprite jpg */
gulp.task('img:sprite-jpg', () => {
    let spriteDataJpg =
        gulp.src(`${path.images.sprite}*.jpg`)
            .pipe(spritesmith({
                imgName: 'sprite.jpg',
                cssName: 'style-jpg.css',
                imgPath: '../img/sprite/sprite.jpg'
            }));
    spriteDataJpg.pipe(gulp.dest(`${dist.img}sprite/`));
});

/* make sprite all */
gulp.task('img:sprite', ['img:sprite-jpg', 'img:sprite-png']);



/** WATCHERS **/

/* watch css */
gulp.task('watch:css', () => {
    gulp.watch([cssSrc], ['css']);
});

/* watch js */
gulp.task('watch:js', () => {
    gulp.watch([`${source.js}**`], ['js']);
});

/* watch img compress and sprite */
gulp.task('watch:img', () => {
    gulp.watch([imgSrc], ['img:min', 'img:sprite'])
});

/* watch all */
gulp.task('watch', ['watch:css', 'watch:js', 'watch:img']);

/* server reload + watching js and css */
gulp.task('reload', ['css', 'js'], () => {
    browserSync.init({
        proxy: "http://main-pack/"
    });
    gulp.watch(cssSrc, ['css']);
    gulp.watch(`${source.js}**`, ['js']);
    gulp.watch('markup/**/*.php').on('change', browserSync.reload);
});




/** USE LIBRARIES **/

/* use bootstrap */
// copy mixins, rename main scss file, fonts copy
gulp.task('bootstrap:prepare', () => {
    gulp.src(`${path.css.bootstrap}bootstrap/mixins/**`)
        .pipe(gulp.dest(`${source.css}bootstrap/mixins`));
    gulp.src(`${path.css.bootstrap}_bootstrap.scss`)
        .pipe(rename("bootstrap.scss"))
        .pipe(gulp.dest(path.css.bootstrap));
    gulp.src(path.fonts.bootstrap)
        .pipe(gulp.dest(dist.fonts));
    gulp.src('bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js')
        .pipe(gulp.dest(source.js));
});
//minify bootstrap and url change
gulp.task('bootstrap:convert', () => {
    setTimeout( () => {
        gulp.src(`${path.css.bootstrap}bootstrap.scss`)
            .pipe(sass())
            .pipe(concat({path: 'bootstrap.min.css', cwd: ''}))
            .pipe(urlAdjuster({
                replace: ['../../fonts', '../fonts/bootstrap']
            }))
            .pipe(csso())
            .pipe(gulp.dest(`${source.css}bootstrap`));
    }, 3000);
});
//main task
gulp.task('use:bootstrap', ['bootstrap:prepare', 'bootstrap:convert', 'js:libs']);

/* use animate.css */
gulp.task('use:animate', () => {
    gulp.src(path.css.animate)
        .pipe(gulp.dest(`${source.css}animate/`))
});

/* use font-awesome */
gulp.task('use:font-awesome', () => {
    gulp.src(path.css.awesomescss)
        .pipe(urlAdjuster({
            replace:  ['../fonts/fontawesome-webfont','../fonts/font-awesome/fontawesome-webfont']
        }))
        .pipe(csso())
        .pipe(gulp.dest(`${source.css}font-awesome`));
    gulp.src(path.fonts.fontawesome)
        .pipe(gulp.dest(`${dist.fonts}font-awesome/`))
});

/* use jquery */
gulp.task('copy:jquery', () => {
    gulp.src('bower_components/jquery/dist/jquery.min.js')
        .pipe(gulp.dest(source.js));
});
gulp.task('use:jquery', ['copy:jquery', 'js:libs']);

/* use fancybox */
gulp.task('copy:fancybox', () => {
    gulp.src('bower_components/fancyBox/source/jquery.fancybox.pack.js')
        .pipe(gulp.dest(source.js));
    gulp.src(path.css.fancyBox)
        .pipe(concat({path: 'fancybox.min.css', cwd: ''}))
        .pipe(urlAdjuster({
            replace:  ['fancybox_','../img/fancyBox/fancybox_']
        }))
        .pipe(urlAdjuster({
            replace:  ['blank','../img/fancyBox/blank']
        }))
        .pipe(csso())
        .pipe(gulp.dest(`${source.css}fancybox`));
    gulp.src(path.images.fancyBox)
        .pipe(gulp.dest(`${dist.img}fancyBox`))
});
gulp.task('use:fancybox', ['copy:fancybox', 'js:libs']);

/* use all */
gulp.task('use', ['use:bootstrap', 'use:animate', 'use:font-awesome', 'use:jquery', 'use:fancybox']);



/** ADDINGS **/

/* add directories */
gulp.task('add:dirs', () => {
    let dirs = [
        'dist',
        'dist/css',
        'dist/js',
        'dist/img',
        'dist/fonts',
        'src/css/components',
        'src/fonts',
        'src/img',
        'src/img/sprite',
        'markup/data',
    ];
    for (var i = 0, l = dirs.length; i < l; i += 1) {
        if (!fs.existsSync(dirs[i])){
            fs.mkdirSync(dirs[i]);
        }
    }
});

/* add all */
gulp.task('add', ['add:dirs']);



/** MAIN TASKS **/
gulp.task('init', ['add', 'use:jquery', 'use:bootstrap', 'js:libs']);
gulp.task('default', ['watch']);