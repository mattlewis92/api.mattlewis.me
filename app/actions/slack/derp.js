export default async function() {

  console.log(this.request.body); //eslint-disable-line no-console
  this.body = {text: 'Derp'};

}