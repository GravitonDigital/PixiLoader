var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var babelify = require('babelify');
var assign = require('lodash.assign');
var browserSync = require('browser-sync');
var del = require('del');

var customOpts = {
    entries: ['./src/index.js'],
    debug: true,
    transform: [
        ['babelify',
            {
                presets: [
                    [
                        "es2015",
                        {
                            loose: true
                        }
                    ]
                ],
                ignore: ["./src/libs/**"]
            }
        ]
    ],
    ignore: ['./src/libs/**']
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

b.on('log', gutil.log);

/**
 * This task removes all files inside the 'dist' directory.
 */
gulp.task('clean', function () {
    del.sync('./dist/**/*');
});

/**
 * This task will copy all files from libs into 'dist/libs'.
 * If you want to process them, just add your code to this task.
 */
gulp.task('libs', ['clean'], function () {
    return gulp.src(['./src/libs/**'])
        .pipe(plumber())
        .pipe(gulp.dest('./dist/libs'))
});

/**
 * This task will copy all files from media into 'dist/media'.
 * If you want to process them, just add your code to this task.
 */
gulp.task('media', ['libs'], function () {
    return gulp.src(['./src/media/**'])
        .pipe(plumber())
        .pipe(gulp.dest('./dist/media'));
});

/**
 * This task will copy all files from styles into 'dist/styles'.
 * If you want to process them, just add your code to this task.
 */
gulp.task('styles', ['libs'], function () {
    return gulp.src(['./src/styles/**'])
        .pipe(plumber())
        .pipe(gulp.dest('./dist/styles'));
});

/**
 * This task will copy index.html into 'dist'.
 * If you want to process it, just add your code to this task.
 */
gulp.task('index', ['media', 'styles'], function () {
    return gulp.src(['./src/index.html'])
        .pipe(plumber())
        .pipe(gulp.dest('./dist'));
});

/**
 * This task will bundle all other js files and babelify them.
 * If you want to add other processing to the main js files, add your code here.
 */
gulp.task('bundle', ['index'], function () {
    return b.bundle()
        .on('error', function (err) {
            console.log(err.message);
            browserSync.notify(err.message, 3000);
            this.emit('end');
        })
        .pipe(plumber())
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        //.pipe(uglify({ compress: false }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'));
});

/**
 * This task starts watching the files inside 'src'. If a file is changed,
 * removed or added then it will run refresh task which will run the bundle task
 * and then refresh the page.
 * 
 * For large projects, it may be beneficial to separate copying of libs and
 * media from bundling the source. This is especially true if you have large
 * amounts of media.
 */
gulp.task('watch', ['bundle'], function () {
    var watcher = gulp.watch(
        [
            './src/**/*',
            './node_modules/pixi.js/**/*'
        ], 
        ['refresh']);
    watcher.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});


/**
 * This task starts browserSync. Allowing refreshes to be called from the gulp
 * bundle task.
 */
gulp.task('browser-sync', ['watch'], function () {
    return browserSync({ server: { baseDir: './dist' } });
});

/**
 * This is the default task which chains the rest.
 */
gulp.task('default', ['browser-sync']);

/**
 * Using a dependency ensures that the bundle task is finished before reloading.
 */
gulp.task('refresh', ['bundle'], browserSync.reload);