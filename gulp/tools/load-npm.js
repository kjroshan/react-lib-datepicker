/* eslint-disable global-require, import/no-extraneous-dependencies */
import get from 'lodash/get';
import isNil from 'lodash/isNil';

export default function create(pkg, cb) {
    const npm = require('npm');
    npm.load({
        loaded: false
    }, (err) => {
        if (err) {
            return cb(err);
        }
        if (isNil(get(pkg, 'publishConfig.registry'))) {
            return cb('registry is missing');
        }
        npm.config.set('registry', get(pkg, 'publishConfig.registry'));

        return cb(null, npm);
    });
}
