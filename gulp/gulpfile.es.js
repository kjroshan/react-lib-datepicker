/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import runSequence from 'run-sequence';
import loadPlugins from 'gulp-load-plugins';
import registerTasks from 'gulp-tasks-registrator';

import env from './env.js';

const $ = loadPlugins({
    pattern: [
        'gulp',
        'gulp-*',
        'gulp.*',
        'del',
        'browserify',
        'vinyl-source-stream',
        'vinyl-buffer',
        'glob',
        'lodash',
        'merge-stream',
        'isparta',
        'mochify',
        'disc'
    ],
    scope: ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'],
    replaceString: /^gulp(-|\.)/,
    rename: {
        del: 'delete'
    }
});

registerTasks({
    gulp: $.gulp,
    dir: path.join(__dirname, 'tasks'),
    args: [$, env],
    verbose: true,
    panic: true,
    group: true
});


$.gulp.task('install', (done) => {
    return runSequence(
        'npm:install-peer-dependencies',
        done
    );
});

$.gulp.task('buildJS', (done) => {
    return runSequence(
        'clean:scripts',
        ['format:scripts', 'format:schema'],
        ['lint:scripts', 'lint:schema'],
        ['build:scripts', 'build:schema'],
        done
    );
});

$.gulp.task('buildCSS', (done) => {
    return runSequence(
        'clean:styles',
        'lint:styles',
        'build:styles',
        done
    );
});

$.gulp.task('build', (done) => {
    return runSequence(
        ['buildCSS', 'buildJS'],
        done
    );
});

$.gulp.task('test', (done) => {
    return runSequence(
        'test:istanbul',
        'test:scripts',
        done
    );
});

$.gulp.task('buildALL', (done) => {
    return runSequence(
        'clean',
        'build',
        'analyze',
        'test',
        done
    );
});

$.gulp.task('analyzeStyles', (done) => {
    return runSequence(
        'build:styles',
        'analyze:styles',
        done
    );
});

$.gulp.task('analyzeScripts', (done) => {
    return runSequence(
        'analyze:scripts',
        done
    );
});

$.gulp.task('registry', (done) => {
    return runSequence(
        'npm:registry',
        done
    );
});

$.gulp.task('version', (done) => {
    return runSequence(
        'npm:version',
        done
    );
});

$.gulp.task('publish', (done) => {
    return runSequence(
        'buildALL',
        'npm:whoami',
        'npm:publish',
        done
    );
});

$.gulp.task('republish', (done) => {
    return runSequence(
        'buildALL',
        'npm:whoami',
        'npm:unpublish',
        'npm:publish',
        done
    );
});

$.gulp.task('publish-server-only', (done) => {
    return runSequence(
        'buildALL',
        'npm:whoami',
        'npm:version',
        'npm:publish',
        'git:push',
        'git:push-tags',
        done
    );
});

$.gulp.task('default', (done) => {
    runSequence('buildJS', done);
});
