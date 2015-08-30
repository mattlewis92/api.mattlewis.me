import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import {exec} from 'child_process';

gulp.task('start', () => {

  exec('heroku config', (error, stdout) => {

    const env = {
      NODE_ENV: 'development'
    };

    stdout.trim().split('\n').forEach((line, index) => {
      if (index !== 0) {
        const parts = line.split(':');
        env[parts[0].trim()] = parts[1].trim();
      }
    });

    nodemon({
      script: 'app/index.js',
      ext: 'js',
      env: env
    });

  });

});

gulp.task('default', ['start']);