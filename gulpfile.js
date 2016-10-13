var gulp = require('gulp');
var del = require('del');
var rev = require('gulp-rev');
var nano = require('gulp-cssnano');
var uglify = require('gulp-uglify')
var useref = require('gulp-useref');
var imagemin = require('gulp-imagemin');
var revCollector = require('gulp-rev-collector');
var browserSync = require('browser-sync').create();
var gulpSequence = require('gulp-sequence');
var uncss = require('gulp-uncss');
var htmlmin = require('gulp-htmlmin');
var base64 = require('gulp-base64');
var changed = require('gulp-changed');
var postcss = require("gulp-postcss");
var sprites = require('postcss-sprites').default;
var autoprefixer = require('autoprefixer');
var cssgrace = require('cssgrace');

var SRC_DIR = './src/';
var PKG_DIR = './tmp/pkg/';
var REV_DIR = './tmp/rev/';
var DST_DIR = './dist/';
var UNCSS_REG = [/.advise/, /.block/, /.g-bd .m-view-2 .category li:nth-child/, /^.g-bd ul li .info/, /.hljs/];

gulp.task('clean', function() {
    return del(['dist', 'tmp']);
});

/*
 * 合并请求
 * <!-- build:css ../css/index.pkg.css --><!-- endbuild -->
 * <!-- build:js ../js/index.pkg.js --><!-- endbuild -->
 */
gulp.task('pkg', function() {
    return gulp.src(SRC_DIR + 'view/*.html')
        .pipe(useref())
        .pipe(gulp.dest(PKG_DIR + 'view/'));
});

/*
 * 移动非jpg/png资源到img文件夹
 *
 */
gulp.task('move-img-other', function() {
    return gulp.src([SRC_DIR + 'img/**/*.*!(jpg|png)', SRC_DIR + 'component/img/**/*.*!(jpg|png)'])
        .pipe(gulp.dest('./tmp/pkg/img/'));
});

/*
 * 压缩IMG
 *
 */
gulp.task('min-img', function() {
    return gulp.src([SRC_DIR + 'img/**/*.*(jpg|png)', SRC_DIR + 'component/img/**/*.*(jpg|png)'])
        .pipe(imagemin())
        .pipe(gulp.dest('./tmp/pkg/img/'));
});

/*
 * 压缩CSS(PC)
 *
 */
gulp.task("min-css-pc", function() {
    // PostCSS
    var processors = [
        sprites({
            'stylesheetPath': PKG_DIR + 'css/',
            'spritePath': PKG_DIR + 'img/'
        }),
        autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'ie 6-11']
        }),
        cssgrace
    ];
    return gulp.src([PKG_DIR + 'css/**/*.css'])
        .pipe(uncss({
            html: [PKG_DIR + '**/*.html'],
            ignore: UNCSS_REG
        })).pipe(nano({
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(postcss(processors))
        .pipe(gulp.dest(PKG_DIR + 'css/'))
});

/*
 * 压缩CSS(Mobile)
 *
 */
gulp.task("min-css-mobile", function() {
    // PostCSS
    var processors = [
        autoprefixer({
            browsers: ['> 1%', 'last 2 versions']
        })
    ];
    return gulp.src([PKG_DIR + 'css/**/*.css'])
        .pipe(uncss({
            html: [PKG_DIR + '**/*.html'],
            ignore: UNCSS_REG
        })).pipe(nano({
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(postcss(processors))
        .pipe(gulp.dest(PKG_DIR + 'css/'))
});

/*
 * 压缩JS
 *
 */
gulp.task('min-js', function() {
    return gulp.src(PKG_DIR + 'js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(PKG_DIR + 'js/'));
});

/*
 * 版本化IMG
 *
 */
gulp.task('rev-img', function() {
    return gulp.src(PKG_DIR + 'img/**/*')
        .pipe(rev())
        .pipe(gulp.dest(REV_DIR + 'img/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(REV_DIR + 'img/'));
});

/*
 * 版本化CSS
 *
 */
gulp.task('rev-css', function() {
    return gulp.src(PKG_DIR + 'css/**/*')
        .pipe(rev())
        .pipe(gulp.dest(REV_DIR + 'css/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(REV_DIR + 'css/'));
});

/*
 * 版本化JS
 *
 */
gulp.task('rev-js', function() {
    return gulp.src(PKG_DIR + 'js/**/*')
        .pipe(rev())
        .pipe(gulp.dest(REV_DIR + 'js/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(REV_DIR + 'js/'));
});

/*
 * 收集图片到CSS
 */
gulp.task('col-css', function() {
    return gulp.src([REV_DIR + 'img/*.json', REV_DIR + 'css/*.css'])
        .pipe(revCollector())
        .pipe(gulp.dest(DST_DIR + 'css/'));
});

/*
 * 移动IMG文件到目标文件夹
 */
gulp.task('col-img', function() {
    return gulp.src([REV_DIR + 'img/*', '!' + REV_DIR + '/img/*.json'])
        .pipe(gulp.dest(DST_DIR + 'img/'));
});

/*
 * 移动JS文件到目标文件夹
 */
gulp.task('col-js', function() {
    return gulp.src(REV_DIR + 'js/*.js')
        .pipe(gulp.dest(DST_DIR + 'js/'));
});

/*
 * 收集资源到HTML
 */
gulp.task('col-html', function() {
    return gulp.src([REV_DIR + '**/*.json', PKG_DIR + 'view/*.html'])
        .pipe(revCollector())
        .pipe(htmlmin({
            // collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(DST_DIR + 'view/'));
});

/*
 * 移动mock文件夹
 */
gulp.task('move-mock', function() {
    return gulp.src(SRC_DIR + 'mock/**/*')
        .pipe(gulp.dest(DST_DIR + 'mock/'));
});

/*
 * 图片base64
 */
gulp.task('base64', function() {
    return gulp.src(PKG_DIR + '/**/*.css')
        .pipe(base64({
            extensions: ['svg', 'png', /\.jpg#datauri$/i],
        }))
        .pipe(gulp.dest(PKG_DIR));
});


/*
 * 静态服务器
 */
gulp.task('bs', function() {
    browserSync.init({
        files: "**", //监听整个项目
        open: "external",
        server: {
            baseDir: "./dist/",
            index: 'view/index.html'
        }
    });
});

/*
 * 静态服务器(代理)
 */
gulp.task('bsp', function() {
    browserSync.init({
        proxy: "127.0.0.1"
    });
});

/*
 * PC打包方案
 */
gulp.task('pc', gulpSequence(
    'clean', 'pkg', 'min-img',
    ['min-img', 'min-css-pc', 'min-js'], 'move-img-other',
    ['rev-img', 'rev-css', 'rev-js'],
    ['col-img', 'col-css', 'col-js', 'col-html'],
    'move-mock', 'bs'
));

/*
 * Mobile打包方案
 */
gulp.task('mobile', gulpSequence(
    'clean', 'pkg', 'min-img', 'base64', 'move-img-other',
    ['min-img', 'min-css-mobile', 'min-js'],
    ['rev-img', 'rev-css', 'rev-js'],
    ['col-img', 'col-css', 'col-js', 'col-html'],
    'move-mock', 'bs'
));


gulp.task('default', ['mobile'], function() {
    return del(['tmp/']);
});