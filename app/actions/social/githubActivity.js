import fetch from 'node-fetch';
const GITHUB_USERNAME = 'mattlewis92';

export default async function () {

  const result = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public`);
  this.body = await result.json();

}