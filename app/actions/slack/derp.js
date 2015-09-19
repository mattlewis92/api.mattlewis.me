export default async function() {

  console.log(this.request);
  this.body = {success: true};

}