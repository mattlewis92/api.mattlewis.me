import fetch from 'node-fetch';
const GITHUB_USERNAME = 'mattlewis92';

export default function* () {

  const result = yield fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public`);
  this.body = yield result.json();

}