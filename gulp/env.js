/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const _ = require('lodash');
const argv = require('minimist')(process.argv.slice(2));

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const NODE_MODULES = path.join(ROOT_DIR, 'node_modules');

module.exports = {
    name: 'base',
    version: _.get(argv, 'V', _.get(argv, 'version', null)),
    registry: _.get(argv, 'r', _.get(argv, 'registry', null)),
    paths: {
        root: ROOT_DIR,
        input: {
            scripts: {
                main: `${SRC_DIR}/scripts/index.js`,
                src: [
                    `${SRC_DIR}/scripts/**/*.js`,
                    `!${SRC_DIR}/scripts/**/*spec.js`
                ],
                schema: [
                    `${SRC_DIR}/scripts/**/*.json`
                ]
            },
            test: {
                scripts: [
                    `${ROOT_DIR}/test/**/*.js`,
                    `${SRC_DIR}/scripts/**/*spec.js`
                ],
                exclude: [
                    `!${SRC_DIR}/scripts/index.js`
                ]
            },
            styles: {
                main: `${SRC_DIR}/styles/main.scss`,
                scss: [`${SRC_DIR}/styles/**/*.scss`, NODE_MODULES],
                css: []
            }
        },
        output: {
            scripts: `${ROOT_DIR}/lib`,
            styles: {
                bundle: 'bundle.css',
                dir: `${SRC_DIR}/styles`
            },
            coverage: `${ROOT_DIR}/coverage`
        }
    },
    thresholds: {
        coverage: {
            global: 0,
            each: 0
        },
        css: 500,
        js: 200
    }
};
