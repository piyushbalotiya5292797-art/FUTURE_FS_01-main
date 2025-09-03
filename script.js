const mongoose = require("mongoose");
mongo_url = 'mongodb://127.0.0.1:27017/portfolio'

async function main() {
  await mongoose.connect(mongo_url);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

main()
    .then(() => console.log("connected to database"))
    .catch((err) => console.log(err));


const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name: String,
    email: String,
    message: String
})

const Contact = mongoose.model("Contact", contactSchema)

module.exports = Contact;