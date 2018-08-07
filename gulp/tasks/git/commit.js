import path from 'path';

export default function factory($, env) {
    return function task() {
        return $.gulp.src([
            path.join(env.paths.root)
        ])
        .pipe($.git.add({
            args: '--all'
        }))
        .pipe($.git.commit('Code Cleanup')).on('end', () => {
        });
    };
}
