const {exec} = require('child_process');
const nodemon = require('nodemon');

exec('heroku config -a mattlewis-api', (error, stdout) => {
  const env = {
    NODE_ENV: 'development'
  };

  stdout
    .trim()
    .split('\n')
    .forEach((line, index) => {
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
    env
  });
});
