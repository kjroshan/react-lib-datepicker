export default function factory($, env) {
    return function task(done) {
        const scss = $.gulp
            .src(env.paths.input.styles.main)
            .pipe($.sass({ includePaths: env.paths.input.styles.scss })
              .on('error', (err) => {
                  $.util.log($.util.colors.red(err.toString()));
                  process.exit(1);
              })
            );

        const css = $.gulp.src(env.paths.input.styles.css);

        return $.mergeStream([scss, css])
          .pipe($.cssnano())
          .pipe($.concat(env.paths.output.styles.bundle))
          .pipe($.gulp.dest(env.paths.output.styles.dir))
          .on('error', (err) => {
              done(err);
          });
    };
}
