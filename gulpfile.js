var gulp   = require('gulp');
var nodemon   = require('gulp-nodemon');
var exec = require('child_process').exec;

gulp.task('start', function() {

  exec('heroku config', function puts(error, stdout, stderr) {

    var env = {
      'NODE_ENV': 'development'
    };

    stdout.trim().split('\n').forEach(function(line, index) {
      if (index !== 0) {
        var parts = line.split(':');
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