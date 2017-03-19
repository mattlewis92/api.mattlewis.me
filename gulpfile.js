const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const {exec} = require('child_process');

gulp.task('start', (done) => {

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
    }).on('end', done);

  });

});

gulp.task('default', ['start']);