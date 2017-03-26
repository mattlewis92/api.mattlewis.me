const fetch = require('node-fetch');

const GITHUB_USERNAME = 'mattlewis92';

module.exports = async ctx => {

  const result = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
  ctx.body = await result.json();

};