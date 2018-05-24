const nodemon = require('gulp-nodemon');
const {exec} = require('child_process');

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