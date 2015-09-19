export default async function() {

  console.log(this.request); //eslint-disable-line no-console
  this.body = {success: true};

}