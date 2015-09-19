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
        const variable = parts.shift().trim();
        const value = parts.join(':').trim();
        env[variable] = value;
      }
    });

    nodemon({
      script: 'index.js',
      ext: 'js',
      env: env
    });

  });

});

gulp.task('default', ['start']);