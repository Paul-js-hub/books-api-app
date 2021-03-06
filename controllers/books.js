import Book from '../models/bookModel';
import Joi from '@hapi/joi';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import fileupload from 'express-fileupload'

dotenv.config();

exports.books_get_all = async (req, res) => {
    try {
        const books = await Book.find();
        return res.send(books);
    } catch (err) {
        res.send(err)
    }

}
exports.books_get_byId = async (req, res) => {
    //return a particular book with an id
    const book = await Book.findById(req.params.id); // Looking up for the book
    if (!book) res.status(404).send({message:'The book with that particular ID not found.'}); ////If it does not exist return Not Found 
    res.send({message: 'Success', book});
}
exports.books_create = (req, res) => {

    // Validating the request body using joi
    //console.log("request", req.files);
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        author: Joi.string().min(3).required(),
    });
    const result = schema.validate(req.body);

   
    // If invalid return a 400 error
    if (result.error) {
        res.status(400).send({message:result.error.details[0].message});
        return;
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })


    const bookImage = req.files.bookImage;
    cloudinary.uploader.upload(bookImage.tempFilePath, (result, error) => {
        if (result) {
            
            const data = {
                title:req.body.title,
                author:req.body.author,
                bookImage:result.url
            }
            const book = new Book(data);
          
            book.save().then((doc) => {
                res.status(201).send({ message: 'Your book has been successfully uploaded', doc })
            }).catch((err) => {
                res.status(500).send({ message: 'Something went wrong while processing your request', err })
            })
        }
        else{
            res.send({message:"Something went wrong while processing your request"})
        }
    })


}

exports.books_update_byId = async (req, res) => {

    const book = await Book.updateOne(
        { _id: req.params.id },
        { $set: { title: req.body.title } },
    );
  
    if (!book) res.status(404).send({message:'The book with that particular ID not found.', book});

    const { error } = validateBook(req.body); // result.error
    if (error) {
        res.status(400).send({message: error.details[0].message});
        return;
    }
    // returning the updated book to the client
    return res.status(201).send({message: 'Success', book});
}

exports.books_delete_byId = async (req, res) => {
    const book = await Book.deleteOne({ _id: req.params.id });
    if (!book) res.status(404).send({message: 'The book with that particular ID not found.'});

    else {
        res.send({message:'Book deleted successfully'})
    }

    return res.status(200).send(book);
}

function validateBook(book) {
    const schema = Joi.object({
        title: Joi.string().min(3).required()
    });
    return schema.validate(book);
}
