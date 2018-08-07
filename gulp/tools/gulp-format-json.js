/* eslint-disable import/no-extraneous-dependencies, no-param-reassign */
import through from 'through2';

export default function formatJSON(spaces = 2) {
    return through.obj((file, encoding, callback) => {
        if (file.isNull()) {
            callback(null, file);
            return;
        }

        if (file.isStream()) {
            callback(new Error('Streaming not supported'));
            return;
        }
        file.contents = new Buffer(`${JSON.stringify(JSON.parse(file.contents.toString('utf8')), null, spaces)}\n`);

        callback(null, file);
    });
}
