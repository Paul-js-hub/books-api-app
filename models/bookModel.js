import mongoose from 'mongoose'

//Define a schema
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: String,
    author: String,
    bookImage:String
});

const bookModel = mongoose.model('Book', bookSchema)
//export default bookModel;
module.exports = bookModel